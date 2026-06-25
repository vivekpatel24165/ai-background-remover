```ts
export async function POST(request: Request) {
  try {
    console.log(
      "REMOVE_BG_API_KEY exists:",
      !!process.env.REMOVE_BG_API_KEY
    );

    if (!process.env.REMOVE_BG_API_KEY) {
      return Response.json(
        {
          error:
            "REMOVE_BG_API_KEY is missing in Vercel Environment Variables",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return Response.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const removeBgForm = new FormData();
    removeBgForm.append("image_file", image);
    removeBgForm.append("size", "auto");

    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        body: removeBgForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Remove.bg Error:", errorText);

      return Response.json(
        {
          error: errorText,
        },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition":
          'attachment; filename="background-removed.png"',
      },
    });
  } catch (error) {
    console.error("Server Error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
```
