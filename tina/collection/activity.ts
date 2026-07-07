import type { Collection } from "tinacms";

const Activity: Collection = {
  label: "Activities",
  name: "activity",
  path: "content/activities",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "rich-text",
      label: "Description",
      name: "body",
      isBody: true,
    },
  ],
};

export default Activity;
