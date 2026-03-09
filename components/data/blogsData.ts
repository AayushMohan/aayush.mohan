export type BlogPreview = {
 title: string;
 excerpt: string;
 content: string;
 date: string;
 readTime: string;
 category: string;
 url: string;
 slug: string;
 image: string;
};

export const blogs: BlogPreview[] = [
 {
  title: "RAG, Explained for Builders: A Practical Guide That Actually Helps",
  excerpt:
   "Retrieval-Augmented Generation (RAG) has become the default architecture for almost every serious AI product today. Not because it's trendy, but because it solves a real problem.",
  content:
   "RAG isn't about vector databases. It isn't about fancy prompts. It's about designing a reliable information system around a model. The teams that succeed with RAG aren't the ones chasing the newest framework — they're the ones obsessing over data quality, retrieval behavior, failure modes, and evaluation.",
  date: "January 11, 2026",
  readTime: "8 min read",
  category: "AI / ML",
  url: "https://medium.com/@aayushmohan/rag-explained-for-builders-a-practical-guide-that-actually-helps-32f7ef0f9879",
  slug: "rag-explained-for-builders-a-practical-guide-that-actually-helps-32f7ef0f9879",
  image: "https://cdn-images-1.medium.com/max/1024/0*6kcmIfmQK9WXV6eE",
 },
 {
  title:
   "Unlocking the Power of PyTorch: A Deep Dive into 5 Essential Functions",
  excerpt:
   "PyTorch has become a staple in the deep learning community due to its flexibility and dynamic computational graph.",
  content:
   "From torch.Tensor() for building blocks of computation to torch.nn.Module for constructing neural networks — these five essential functions will elevate your understanding and utilization of this powerful framework.",
  date: "August 11, 2023",
  readTime: "6 min read",
  category: "Deep Learning",
  url: "https://medium.com/@aayushmohan/unlocking-the-power-of-pytorch-a-deep-dive-into-5-essential-functions-dff659f14220",
  slug: "unlocking-the-power-of-pytorch-a-deep-dive-into-5-essential-functions-dff659f14220",
  image: "https://cdn-images-1.medium.com/max/1024/0*M9ABs0ccomjjUK6t",
 },
 {
  title:
   "Unleashing the Power of Machine Learning: 5 Expert Strategies for Success",
  excerpt:
   "Whether you're starting your ML journey or striving to enhance your expertise, adopting the right strategies is crucial.",
  content:
   "Master the fundamentals, embrace Python as your go-to language, ignite learning through practical projects, navigate the shifting tides of new techniques, and leverage collaboration as your north star.",
  date: "June 7, 2023",
  readTime: "5 min read",
  category: "Machine Learning",
  url: "https://medium.com/@aayushmohan/unleashing-the-power-of-machine-learning-5-expert-strategies-for-success-447697314811",
  slug: "unleashing-the-power-of-machine-learning-5-expert-strategies-for-success-447697314811",
  image: "https://cdn-images-1.medium.com/max/1024/0*LgdZ8MbBMBcYCxAc",
 },
];
