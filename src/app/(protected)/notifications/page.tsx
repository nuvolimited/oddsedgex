import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import React from "react";

async function Notifications() {
  const userId = (await auth())?.user.id;

  if (!userId) redirect("/");

  const notificationList = await db.query.notifications.findMany({
    where: (notifications, { eq }) => eq(notifications.userId, userId),
    orderBy: (notifications, { desc }) => desc(notifications.createdAt),
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <Header title="Notifications">
        <p className="text-muted-foreground">
          You have {notificationList.length} notifications.
        </p>
      </Header>

      <div className="flex flex-col gap-4 px-4 divide-y">
        {notificationList.map((notification) => (
          <div key={notification.id} className="py-4">
            <p className="font-medium">{notification.title}</p>
            <p className="text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
