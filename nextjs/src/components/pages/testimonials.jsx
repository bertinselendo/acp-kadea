"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
  {
    avatarLink: "https://github.com/shadcn.png",
    title: "Client",
    subTitle: "Titre temoignage client",
    content:
      "Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mol litia,molestiae quas vel sint comm",
  },
];

export default function Testimonials() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="relative">
      <div className="z-10 mt-10 grid grid-flow-row grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {testimonials.map((testimonial, index) =>
          isDesktop ? (
            <div
              key={index}
              className="h-max"
              style={index > 3 ? { marginTop: "-40px" } : {}}
            >
              <Testimonial
                avatarLink={testimonial.avatarLink}
                title={testimonial.title}
                subTitle={testimonial.subTitle}
                content={testimonial.content}
                className={cn(index % 2 == 0 && "mt-10")}
              />
            </div>
          ) : (
            <div
              key={index}
              className="h-max"
              style={index > 1 ? { marginTop: "-20px" } : {}}
            >
              <Testimonial
                avatarLink={testimonial.avatarLink}
                title={testimonial.title}
                subTitle={testimonial.subTitle}
                content={testimonial.content}
                className={cn(index % 2 == 0 && "mt-5")}
              />
            </div>
          ),
        )}
      </div>
      <div className="absolute bottom-0 z-20 h-80 w-full bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
}

export function Testimonial({
  avatarLink,
  title,
  subTitle,
  content,
  className,
}) {
  return (
    <Card className={cn(className, "h-max")}>
      <CardContent className="p-4 text-left">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={`${avatarLink}`} alt="@shadcn" />
            <AvatarFallback>PH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start">
            <h4 className="text-sm font-bold">{title}</h4>
            <p className="text-sm">{subTitle}</p>
          </div>
        </div>
        <div className="pt-10 text-sm">{content}</div>
      </CardContent>
    </Card>
  );
}
