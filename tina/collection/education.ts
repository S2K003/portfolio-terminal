import type { Collection } from "tinacms";

const Education: Collection = {
  label: "Education",
  name: "education",
  path: "content/education",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Degree",
      name: "degree",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Institution",
      name: "institution",
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
      label: "Details",
      name: "body",
      isBody: true,
    },
  ],
};

export default Education;
