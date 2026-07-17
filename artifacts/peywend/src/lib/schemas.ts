import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("ئیمەیڵێکی دروست بنووسە"),
  password: z.string().min(6, "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت"),
});

export const usernameSchema = z.object({
  username: z.string().min(3, "ناوی بەکارهێنەر دەبێت لانیکەم ٣ پیت بێت").max(30, "ناوی بەکارهێنەر دەبێت لە ٣٠ پیت کەمتر بێت"),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(1, "ناو نابێت بەتاڵ بێت"),
  email: z.string().email("ئیمەیڵێکی دروست بنووسە"),
  password: z.string().min(6, "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "ناو نابێت بەتاڵ بێت").optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const socialLinksSchema = z.object({
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  snapchat: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  twitch: z.string().optional().nullable(),
});
