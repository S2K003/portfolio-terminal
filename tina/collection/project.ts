import type { Collection } from "tinacms";

const Project: Collection = {
  label: "Projects",
  name: "project",
  path: "content/projects",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Project Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Institution / Organization",
      name: "institution",
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

export default Project;
