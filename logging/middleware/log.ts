const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJpbmZvLm5pbGV4cmFuYUBnbWFpbC5jb20iLCJleHAiOjE3Nzg3NTgwMzAsImlhdCI6MTc3ODc1NzEzMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjE2YWFhZWIxLTFhN2MtNDExMC05YmUxLWQ0MjAyNDQxMmFmNiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im5pbGVzaCByYW5hIiwic3ViIjoiYmY5NTkxY2YtNTU1ZC00MTkyLTg5N2EtYTczYmRkYzAyZDdkIn0sImVtYWlsIjoiaW5mby5uaWxleHJhbmFAZ21haWwuY29tIiwibmFtZSI6Im5pbGVzaCByYW5hIiwicm9sbE5vIjoiMTIzMDcwODAiLCJhY2Nlc3NDb2RlIjoiVFJ2WldxIiwiY2xpZW50SUQiOiJiZjk1OTFjZi01NTVkLTQxOTItODk3YS1hNzNiZGRjMDJkN2QiLCJjbGllbnRTZWNyZXQiOiJtWlNFWVFCQUtLbnp3U2dNIn0.WedrRv78O9gLIRAzSZTuWXhQhKXy4LqbrD2taMKEevg";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "cache" | "controller" | "cron_job" | "db" | "domain"
  | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (err) {
    console.error("Logger failed to send log:", err);
  }
}