import { z } from "zod";

export const employeeSchema = z.object({
    name: z.string().min(2),
    position: z.string().min(2),
    salary: z.number().nonnegative(),
});

export const loginSchema = z.object({
    username: z.string().min(2),
    password: z.string().min(2),
});
