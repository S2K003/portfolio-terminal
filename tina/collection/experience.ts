import type { Collection } from "tinacms";

const Experience: Collection = {
  label: "Experience",
  name: "experience",
  path: "content/experience",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Job Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Company",
      name: "company",
      required: true,
    },
    {
      type: "string",
      label: "Start Date",
      name: "startDate",
    },
    {
      type: "string",
      label: "End Date",
      name: "endDate",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "body",
      isBody: true,
    },
  ],
};

export default Experience;
