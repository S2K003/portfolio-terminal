import type { Collection } from "tinacms";

const Skill: Collection = {
  label: "Skills",
  name: "skill",
  path: "content/skills",
  format: "json",
  fields: [
    {
      type: "string",
      label: "Category",
      name: "category",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Skills List",
      name: "skillsList",
      list: true,
    },
  ],
};

export default Skill;
