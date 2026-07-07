import type { Collection } from "tinacms";

const Certification: Collection = {
  label: "Certifications",
  name: "certification",
  path: "content/certifications",
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
      type: "string",
      label: "Issuer",
      name: "issuer",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "body",
      isBody: true,
    },
  ],
};

export default Certification;
