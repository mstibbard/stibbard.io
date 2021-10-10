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

export type Toast = {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  dismissible: boolean;
  duration: number;
};

export type RevenueModels = 'Subscription' | 'Sales' | 'Freemium' | 'None';

export type BusinessModels = 'B2B' | 'B2C' | 'None';
