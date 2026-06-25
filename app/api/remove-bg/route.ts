export async function POST(request: Request) {
  try {
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
          "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
        },
        body: removeBgForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: errorText },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}