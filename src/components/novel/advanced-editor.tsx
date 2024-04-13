"use client";
import { defaultEditorContent } from "@/lib/content";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorInstance,
  EditorCommandList,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  documentCreationAction,
  documentTitleUpdatetAction,
  documentUpdatetAction,
  getProjectDocument,
} from "../admin/documents/documents.action";
import { usePathname, useRouter } from "next/navigation";
import { Document, User } from "@prisma/client";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjectAllUsers } from "../admin/projects/project.action";
import { sendNewDocumentNotification } from "@/jobs";
import { useSession } from "next-auth/react";
import { getServerUrl } from "@/lib/server-url";

const extensions = [...defaultExtensions, slashCommand];

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(60, {
      message: "The limit is 60 characters.",
    }),
});

const TailwindAdvancedEditor = (props: {
  projectID: string;
  documentID: string;
}) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [documentTitle, setDocumentTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const router = useRouter();
  const pathname = usePathname();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const session = useSession();
  const currentUser = session?.data?.user as User;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const editorMutation = useMutation({
    mutationFn: async (json: JSONContent) => {
      const values = {
        title: documentTitle ? documentTitle : "Untitled...",
        type: "internal",
        content: JSON.stringify(json),
      };

      if (!props.documentID) {
        const saveTitle = await documentCreationAction(
          values as Document,
          props.projectID
        );

        if (saveTitle) {
          toast.success("Document created");
          setDocumentTitle(saveTitle.title);

          // send notification
          const users = await getProjectAllUsers(props.projectID);
          const usersToNotify = users.filter(
            (user) => user.id != saveTitle.createdBy
          );
          const emailsUsers = usersToNotify.map((user) => user.email);
          sendNewDocumentNotification({
            userEmail: emailsUsers,
            senderEmail: currentUser?.email,
            senderName: currentUser?.firstName ?? "somme one",
            reference: saveTitle.project.title,
            link: `${getServerUrl()}/p/${props.projectID}/documents`,
          });

          router.push(pathname + "?doc=" + saveTitle.id);
        } else {
          toast.error("Error creating document");
          return;
        }
      } else {
        const saveDocument = await documentUpdatetAction(
          values as Document,
          props.documentID
        );
        if (!saveDocument) {
          toast.error("Error: Wait and try again !");
        }

        return saveDocument;
      }
    },
  });

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();

      editorMutation.mutateAsync(json);
      setSaveStatus("Saved");
    },
    3000
  );

  useQuery({
    queryKey: ["documentData"],
    queryFn: async () => {
      if (props.documentID) {
        const document = await getProjectDocument(props.documentID);
        form.reset({
          title: document?.title,
        });
        setDocumentTitle(`${document?.title}`);
        if (document?.content) setInitialContent(JSON.parse(document.content));
        else setInitialContent(defaultEditorContent);
        return document;
      } else {
        setInitialContent(defaultEditorContent);
      }
    },
  });

  async function onTitleSubmit(values: z.infer<typeof formSchema> & Document) {
    setSaveStatus("Unsaved");
    if (!props.documentID) {
      values.type = "internal";
      values.content = JSON.stringify(initialContent);

      const saveTitle = await documentCreationAction(values, props.projectID);
      if (saveTitle) {
        toast.success("Document created");
        router.push(pathname + "?doc=" + saveTitle.id);
      }
    } else {
      const saveTitle = await documentTitleUpdatetAction(
        values.title,
        props.documentID
      );
      if (!saveTitle) {
        toast.error("Error: Wait and try again !");
      }
    }
    setSaveStatus("Saved");
  }

  if (!initialContent) return null;

  return (
    <>
      <div className="my-4">
        <Form {...form}>
          <form
            onBlur={form.handleSubmit(onTitleSubmit as any)}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-[70%]">
                  <FormControl>
                    <Input
                      placeholder="Document title..."
                      {...field}
                      className="border-none bg-transparent text-2xl font-semibold rounded-none outline-none shadow-none focus:outline-none focus:border-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button type="submit">Save</Button> */}
          </form>
        </Form>
      </div>
      <div className="relative w-full">
        <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
        <EditorRoot>
          <EditorContent
            initialContent={initialContent}
            extensions={extensions}
            className="relative min-h-[500px] w-full border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) =>
                handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => {
                      item.command && item.command(val);
                    }}
                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />

              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector
                open={openColor}
                onOpenChange={setOpenColor}
                isOpen={false}
                setIsOpen={function (
                  value: React.SetStateAction<boolean>
                ): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </GenerativeMenuSwitch>
          </EditorContent>
        </EditorRoot>
      </div>
    </>
  );
};

export default TailwindAdvancedEditor;
