const getRagApiUrl = () => {
  const apiUrl = import.meta.env.VITE_RAG_API_URL?.replace(/\/$/, "");

  if (!apiUrl) {
    throw new Error("VITE_RAG_API_URL is not configured.");
  }

  return apiUrl;
};

const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const responseText = await response.text();
    if (!responseText) return fallbackMessage;

    try {
      const data = JSON.parse(responseText);
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.detail)) {
        const validationMessage = data.detail
          .map((item) => item.msg)
          .filter(Boolean)
          .join(" ");
        if (validationMessage) return validationMessage;
      }
      if (typeof data.message === "string") return data.message;
    } catch {
      return responseText;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
};

const request = async (path, options, fallbackMessage) => {
  const response = await fetch(`${getRagApiUrl()}${path}`, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallbackMessage));
  }

  return response.json();
};

export const uploadRagDocument = (file, userId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  return request(
    "/api/documents/upload",
    {
      method: "POST",
      body: formData,
    },
    "Failed to upload document.",
  );
};

export const askRagQuestion = (question, userId, documentId) =>
  request(
    "/api/ask",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        user_id: userId,
        document_id: documentId,
      }),
    },
    "Failed to get an answer.",
  );