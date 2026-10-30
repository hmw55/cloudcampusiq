
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: null,
      },
    },
  }),
);

app.use(express.json({ limit: "10kb" }));

const courses = [
  {
    id: "cloud-foundations",
    title: "Cloud Computing Foundations",
    category: "Cloud Computing",
    level: "Beginner",
    duration: "6 hours",
    description:
      "Explore cloud infrastructure, deployment models, and essential AWS services.",
  },
  {
    id: "network-security",
    title: "Network Security Essentials",
    category: "Cybersecurity",
    level: "Intermediate",
    duration: "8 hours",
    description:
      "Learn network segmentation, identity management, encryption, and monitoring.",
  },
  {
    id: "devops-practices",
    title: "Modern DevOps Practices",
    category: "DevOps",
    level: "Intermediate",
    duration: "10 hours",
    description:
      "Understand CI/CD pipelines, infrastructure automation, and observability.",
  },
  {
    id: "software-architecture",
    title: "Software Architecture Fundamentals",
    category: "Software Engineering",
    level: "Beginner",
    duration: "7 hours",
    description:
      "Design maintainable applications using modern architectural principles.",
  },
];

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "cloudcampusiq",
  });
});

app.get("/api/courses", (_req: Request, res: Response) => {
  res.json({ courses, total: courses.length });
});

app.get("/api/courses/:id", (req: Request, res: Response) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json(course);
});

app.use(express.static(path.join(process.cwd(), "public")));

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Resource not found" });
});

app.use(
  (error: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error("Application error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CloudCampusIQ listening on port ${PORT}`);
});
