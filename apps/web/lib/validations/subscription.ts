import * as z from "zod";

const appSubscriptionType = z.enum(["starter", "analyst", "professional"]);
const dataSubscriptionType = z.enum(["data"]);
console.log(dataSubscriptionType);

export const subscriptionBaseSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  avatar_url: z.string().url(),
  start_date: z.string(),
  end_date: z.string(),
});

export const appSubscriptionSchema = z.array(
  subscriptionBaseSchema.extend({
    subscription_type: appSubscriptionType,
    organization_id: z.string().uuid(),
    seat: z.number().optional(),
  })
);

export const dataSubscriptionSchema = subscriptionBaseSchema.extend({
  subscription_type: z.enum(["data"]),
  organization_id: z.string().uuid(),
});

export type AppSubscription = z.infer<typeof appSubscriptionSchema>;
