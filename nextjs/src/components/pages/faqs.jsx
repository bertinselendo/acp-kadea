"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit aptent augue vehicula, fames pretium vulputate primis posuere metus sociis viverra ligula habitasse, id eleifend purus placerat gravida fusce aenean feugiat sociosqu. Tellus pulvinar at natoque facilisi bibendum dignissim ante sed, arcu inceptos nunc est gravida magna primis. Lacus hac conubia praesent etiam eleifend scelerisque libero porta risus, netus luctus dis condimentum nulla quis sodales sociis, ullamcorper vulputate cubilia accumsan fringilla dignissim vehicula aliquam.",
  },
];

export default function Faqs() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto w-full space-y-2 md:w-10/12"
    >
      {faqs.map((faq, index) => (
        <Faq
          key={index}
          index={index}
          title={faq.title}
          content={faq.content}
        />
      ))}
    </Accordion>
  );
}

export function Faq({ index, title, content }) {
  return (
    <AccordionItem
      value={`item-${index}`}
      className="w-full rounded-lg border px-4 py-2 md:px-8"
    >
      <AccordionTrigger className="text-left text-base font-bold md:text-xl">
        {title}
      </AccordionTrigger>
      <AccordionContent className="text-base">{content}</AccordionContent>
    </AccordionItem>
  );
}
