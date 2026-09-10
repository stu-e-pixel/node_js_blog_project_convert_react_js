import * as yup from "yup";

export const blogSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),

  content: yup
    .string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters"),

  category: yup
    .string()
    .required("Category is required"),
});

export type BlogFormData = yup.InferType<typeof blogSchema>;