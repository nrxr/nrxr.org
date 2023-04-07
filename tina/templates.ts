import type { TinaField } from "tinacms";
export function blog_postFields() {
  return [
    {
      type: "string",
      name: "title",
      label: "title",
    },
    {
      type: "datetime",
      name: "date",
      label: "date",
    },
    {
      type: "string",
      name: "keywords",
      label: "keywords",
      list: true,
    },
    {
      type: "string",
      name: "description",
      label: "description",
    },
    {
      type: "string",
      name: "tags",
      label: "tags",
      list: true,
    },
    {
      type: "string",
      name: "categories",
      label: "categories",
      list: true,
    },
    {
      type: "boolean",
      name: "comment",
      label: "comment",
    },
    {
      type: "boolean",
      name: "toc",
      label: "toc",
    },
    {
      type: "boolean",
      name: "autoCollapseToc",
      label: "autoCollapseToc",
    },
    {
      type: "boolean",
      name: "postMetaInFooter",
      label: "postMetaInFooter",
    },
    {
      type: "boolean",
      name: "hiddenFromHomePage",
      label: "hiddenFromHomePage",
    },
    {
      type: "boolean",
      name: "reward",
      label: "reward",
    },
    {
      type: "boolean",
      name: "mathjax",
      label: "mathjax",
    },
    {
      type: "boolean",
      name: "mathjaxEnableSingleDollar",
      label: "mathjaxEnableSingleDollar",
    },
    {
      type: "boolean",
      name: "mathjaxEnableAutoNumber",
      label: "mathjaxEnableAutoNumber",
    },
    {
      type: "object",
      name: "flowchartDiagrams",
      label: "flowchartDiagrams",
      fields: [
        {
          type: "boolean",
          name: "enable",
          label: "enable",
        },
        {
          type: "string",
          name: "options",
          label: "options",
        },
      ],
    },
    {
      type: "object",
      name: "sequenceDiagrams",
      label: "sequenceDiagrams",
      fields: [
        {
          type: "boolean",
          name: "enable",
          label: "enable",
        },
        {
          type: "string",
          name: "options",
          label: "options",
        },
      ],
    },
  ] as TinaField[];
}
