import type { Collection } from "tinacms";

const Publication: Collection = {
  label: "Publications",
  name: "publication",
  path: "content/publications",
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

export default Publication;
