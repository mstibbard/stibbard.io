/// <reference types="@sveltejs/kit" />

export type BlogPost = {
  path: string;
  metadata: {
    layout: string;
    title: string;
    excerpt: string;
    cover: string;
    publishedOn: date;
    updatedOn?: date;
    tags?: string[];
  };
};

export type LearningSnippet = {
  path: string;
  metadata: {
    layout: string;
    title: string;
    publishedOn: date;
    updatedOn?: date;
    tags?: string[];
  };
};
