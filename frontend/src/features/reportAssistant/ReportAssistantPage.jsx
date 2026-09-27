import { useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  Bot,
  FileText,
  LoaderCircle,
  MessageCircleQuestion,
  Send,
  Upload,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { askRagQuestion, uploadRagDocument } from "./services/ragApi";

const ReportAssistantPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [documentId, setDocumentId] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (!user?._id) {
      setError("Your authenticated profile is not ready. Please try again.");
      return;
    }

    setError(null);
    setUploading(true);
    setMessages([]);
    setDocumentId(null);
    setDocumentName(null);

    try {
      const data = await uploadRagDocument(file, user._id);
      setDocumentId(data.document_id);
      setDocumentName(file.name);
      setQuestion("");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong while uploading the document.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleAsk = async (event) => {
    event?.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !documentId || !user?._id || asking) return;

    setAsking(true);
    setPendingQuestion(trimmedQuestion);
    setError(null);

    try {
      const data = await askRagQuestion(trimmedQuestion, user._id, documentId);
      setMessages((current) => [
        ...current,
        {
          question: trimmedQuestion,
          answer: data.answer || "",
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
      setQuestion("");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong while getting the answer.");
    } finally {
      setAsking(false);
      setPendingQuestion("");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><MessageCircleQuestion size={21} /></div><div><h1 className="font-bold text-slate-900">AI Report Assistant</h1><p className="text-xs text-slate-500">Ask questions about your uploaded medical report</p></div></div>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">Patient support</span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:w-64 lg:border-b-0 lg:border-r">
            <h2 className="font-bold text-slate-900">Documents</h2>
            <label className={`mt-5 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition ${uploading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-600 hover:bg-blue-700"}`}>
              {uploading ? <LoaderCircle size={17} className="animate-spin" /> : <Upload size={17} />}
              {uploading ? "Uploading..." : "Upload PDF"}
              <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            {documentId && <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3"><FileText size={19} className="shrink-0 text-blue-600" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{documentName}</p><p className="text-xs text-emerald-700">Ready</p></div></div>}
            <p className="mt-5 text-xs leading-5 text-slate-500">Answers are generated from this report and should be reviewed with your doctor.</p>
          </aside>

          <section className="flex min-h-[30rem] min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8">
              {error && <div className="mx-auto mb-6 flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"><AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" /><div><p className="text-sm font-bold text-red-800">Something went wrong</p><p className="mt-1 break-words text-sm text-red-700">{error}</p></div></div>}
              {!messages.length && !pendingQuestion && !error && <div className="flex min-h-[24rem] items-center justify-center text-center"><div className="max-w-md"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><Bot size={28} /><span className="sr-only">Medical assistant</span></div><h2 className="mt-5 text-xl font-bold text-slate-900">Ask about your medical report</h2><p className="mt-2 text-sm leading-6 text-slate-500">{documentId ? "Your report is ready. Ask a question to get started." : "Upload a medical PDF and ask questions about the information contained in it."}</p></div></div>}
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((message, index) => <div key={`${message.question}-${index}`} className="space-y-4"><div className="flex justify-end gap-3"><div className="max-w-2xl rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm whitespace-pre-wrap text-white">{message.question}</div><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200"><User size={16} className="text-slate-600" /></div></div><div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100"><Bot size={16} className="text-blue-600" /></div><div className="min-w-0 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700"><div className="prose prose-slate max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.answer}</ReactMarkdown></div></div></div>{message.sources.length > 0 && <div className="ml-11"><h3 className="mb-3 text-sm font-bold text-slate-900">Sources</h3><div className="space-y-2">{message.sources.map((source, sourceIndex) => <div key={`${source.document_id}-${source.chunk_index}-${sourceIndex}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"><FileText size={16} className="shrink-0 text-blue-600" /><span className="text-xs text-slate-600"><span className="font-semibold">Page {source.page ?? "N/A"}</span><span className="mx-2">•</span><span>Chunk {source.chunk_index ?? "N/A"}</span></span></div>)}</div></div>}</div>)}
                {pendingQuestion && <><div className="flex justify-end gap-3"><div className="max-w-2xl rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm whitespace-pre-wrap text-white">{pendingQuestion}</div><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200"><User size={16} className="text-slate-600" /></div></div><div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100"><Bot size={16} className="text-blue-600" /></div><div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-4"><div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle size={16} className="animate-spin text-blue-600" />Analyzing your report...</div></div></div></>}
              </div>
            </div>
            <form onSubmit={handleAsk} className="border-t border-slate-200 bg-white p-5"><div className="mx-auto flex max-w-3xl gap-3"><textarea rows="1" value={question} onChange={(event) => { setQuestion(event.target.value); if (error) setError(null); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleAsk(event); } }} placeholder={documentId ? "Ask a question about your report..." : "Upload a report first..."} disabled={!documentId || asking} className="min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100" /><button type="submit" aria-label="Ask assistant" title="Ask assistant" disabled={!documentId || !question.trim() || asking} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">{asking ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}</button></div><p className="mt-2 text-center text-xs text-slate-400">Press Enter to ask. Shift + Enter for a new line.</p></form>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportAssistantPage;