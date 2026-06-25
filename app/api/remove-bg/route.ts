export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return Response.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const removeBgForm = new FormData();
    removeBgForm.append("image_file", image);
    removeBgForm.append("size", "auto");

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "REMOVE_BG_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: removeBgForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}