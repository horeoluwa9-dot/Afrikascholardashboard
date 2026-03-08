import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight, Plus, Sparkles, Wand2, Maximize2, Type,
  Download, Send, Save, BookOpen, Search, Quote,
  MessageCircle, FileText, Loader2, ArrowRight, Copy,
  BookMarked, X,
} from "lucide-react";
import { useAIPapers, AIPaper } from "@/hooks/useAIPapers";
import { streamAIPaper } from "@/lib/aiPaperStream";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ─── AI Assistant Chat ───────────────────────────────
function AIAssistantPanel({ paper }: { paper: AIPaper }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    let assistantContent = "";
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    await streamAIPaper({
      action: "chat",
      context: {
        message: input,
        title: paper.title,
        paper_type: paper.paper_type,
        research_field: paper.research_field,
        citation_style: paper.citation_style,
      },
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantContent };
          return updated;
        });
      },
      onDone: () => setStreaming(false),
      onError: (err) => { toast.error(err); setStreaming(false); },
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4 text-accent" /> AI Assistant
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Ask about writing, sources, or methodology</p>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 text-accent/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Ask the AI to help with your paper</p>
              <div className="mt-3 space-y-1.5">
                {["Generate literature review", "Find recent sources", "Explain methodology", "Rewrite paragraph academically"].map(s => (
                  <button key={s} onClick={() => setInput(s)}
                    className="block w-full text-left text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block max-w-[95%] px-3 py-2 rounded-lg ${
                m.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground"
              }`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{m.content || "..."}</ReactMarkdown>
                  </div>
                ) : m.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask the AI..."
            onKeyDown={e => e.key === "Enter" && sendMessage()} className="text-xs" />
          <Button size="sm" variant="afrika" onClick={sendMessage} disabled={streaming || !input.trim()}>
            {streaming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Sources Panel ───────────────────────────────────
function SourcesPanel({ paper, onAddSource }: { paper: AIPaper; onAddSource: (source: any) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const searchSources = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    let fullText = "";

    await streamAIPaper({
      action: "find_sources",
      context: { query, research_field: paper.research_field },
      onDelta: (chunk) => { fullText += chunk; },
      onDone: () => {
        // Parse the text response into source objects
        const lines = fullText.split("\n").filter(l => l.trim());
        const sources: any[] = [];
        let current: any = {};
        for (const line of lines) {
          if (line.match(/^\d+\.|^-\s*\*\*Title/i) || line.match(/^#+\s/)) {
            if (current.title) sources.push(current);
            current = { title: line.replace(/^\d+\.\s*|^-\s*|^\*\*|\*\*$/g, "").replace(/^#+\s/, "").trim() };
          } else {
            current.detail = (current.detail || "") + line + "\n";
          }
        }
        if (current.title) sources.push(current);
        setResults(sources.length > 0 ? sources : [{ title: fullText.slice(0, 100), detail: fullText }]);
        setSearching(false);
      },
      onError: (err) => { toast.error(err); setSearching(false); },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-accent" /> Research Sources
        </h3>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sources..."
            onKeyDown={e => e.key === "Enter" && searchSources()} className="text-xs" />
          <Button size="sm" variant="outline" onClick={searchSources} disabled={searching}>
            {searching ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="p-2.5 rounded-lg border border-border bg-secondary/30 space-y-1">
              <p className="text-xs font-medium text-foreground line-clamp-2">{r.title}</p>
              {r.detail && <p className="text-[10px] text-muted-foreground line-clamp-3">{r.detail}</p>}
              <div className="flex gap-1.5 pt-1">
                <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1"
                  onClick={() => { onAddSource(r); toast.success("Source added"); }}>
                  <Plus className="h-3 w-3" /> Add Citation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Citation Manager Panel ──────────────────────────
function CitationPanel({ paper, onUpdateSources }: { paper: AIPaper; onUpdateSources: (sources: any[]) => void }) {
  const [generating, setGenerating] = useState(false);
  const [bibliography, setBibliography] = useState("");

  const generateBibliography = async () => {
    setGenerating(true);
    setBibliography("");
    let text = "";
    await streamAIPaper({
      action: "generate_bibliography",
      context: { sources: paper.sources, citation_style: paper.citation_style },
      onDelta: (chunk) => { text += chunk; setBibliography(text); },
      onDone: () => setGenerating(false),
      onError: (err) => { toast.error(err); setGenerating(false); },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <BookMarked className="h-4 w-4 text-accent" /> Citations
        </h3>
        <Badge variant="secondary" className="text-[10px] mt-1">{paper.citation_style}</Badge>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {paper.sources.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No sources added yet. Use the Sources tab to find and add citations.</p>
          )}
          {paper.sources.map((s: any, i: number) => (
            <div key={i} className="p-2 rounded-lg border border-border text-xs">
              <p className="font-medium text-foreground">{s.title}</p>
              <button className="text-destructive text-[10px] mt-1"
                onClick={() => onUpdateSources(paper.sources.filter((_: any, j: number) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {paper.sources.length > 0 && (
          <div className="mt-4 space-y-2">
            <Button size="sm" variant="outline" className="w-full text-xs gap-1" onClick={generateBibliography} disabled={generating}>
              {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Quote className="h-3 w-3" />}
              Generate Bibliography
            </Button>
            {bibliography && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="prose prose-sm max-w-none text-xs text-foreground">
                  <ReactMarkdown>{bibliography}</ReactMarkdown>
                </div>
                <Button size="sm" variant="ghost" className="mt-2 text-[10px] gap-1"
                  onClick={() => { navigator.clipboard.writeText(bibliography); toast.success("Copied!"); }}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─── Main Workspace ──────────────────────────────────
const PaperWorkspace = () => {
  const { id } = useParams<{ id: string }>();
  const { papers, loading, updatePaper } = useAIPapers();
  const [paper, setPaper] = useState<AIPaper | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [rightTab, setRightTab] = useState("assistant");
  const [newSection, setNewSection] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!loading && papers.length > 0 && id) {
      const found = papers.find(p => p.id === id);
      if (found) {
        setPaper(found);
        if (!activeSection && found.sections.length > 0) {
          setActiveSection(found.sections[0]);
          setEditorContent(found.content[found.sections[0]] || "");
        }
      }
    }
  }, [loading, papers, id]);

  const saveContent = useCallback((section: string, content: string) => {
    if (!paper) return;
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const newContent = { ...paper.content, [section]: content };
      updatePaper.mutate({ id: paper.id, content: newContent });
      setPaper(prev => prev ? { ...prev, content: newContent } : null);
    }, 1500);
  }, [paper, updatePaper]);

  const switchSection = (section: string) => {
    // Save current before switching
    if (paper && activeSection) {
      const newContent = { ...paper.content, [activeSection]: editorContent };
      updatePaper.mutate({ id: paper.id, content: newContent });
      setPaper(prev => prev ? { ...prev, content: newContent } : null);
    }
    setActiveSection(section);
    setEditorContent(paper?.content[section] || "");
  };

  const handleAIAction = async (action: string) => {
    if (!paper || generating) return;
    setGenerating(true);

    const allContent = Object.values(paper.content).join("\n\n");
    let result = editorContent;

    await streamAIPaper({
      action,
      context: {
        title: paper.title,
        section: activeSection,
        paper_type: paper.paper_type,
        research_field: paper.research_field,
        citation_style: paper.citation_style,
        content: editorContent,
        existing_content: allContent.slice(0, 4000),
        sections: paper.sections,
      },
      onDelta: (chunk) => {
        if (action === "generate_section" || action === "generate_abstract") {
          result += chunk;
        } else {
          result += chunk;
        }
        setEditorContent(result);
      },
      onDone: () => {
        setGenerating(false);
        saveContent(activeSection, result);
        toast.success("AI generation complete");
      },
      onError: (err) => { toast.error(err); setGenerating(false); },
    });
  };

  const addNewSection = () => {
    if (!newSection.trim() || !paper) return;
    const updatedSections = [...paper.sections, newSection.trim()];
    updatePaper.mutate({ id: paper.id, sections: updatedSections });
    setPaper(prev => prev ? { ...prev, sections: updatedSections } : null);
    setNewSection("");
    setShowAddSection(false);
  };

  const handleAddSource = (source: any) => {
    if (!paper) return;
    const updatedSources = [...paper.sources, source];
    updatePaper.mutate({ id: paper.id, sources: updatedSources });
    setPaper(prev => prev ? { ...prev, sources: updatedSources } : null);
  };

  const handleUpdateSources = (sources: any[]) => {
    if (!paper) return;
    updatePaper.mutate({ id: paper.id, sources });
    setPaper(prev => prev ? { ...prev, sources } : null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!paper) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Paper not found</h3>
          <Link to="/dashboard/ai-papers"><Button variant="afrika" className="mt-4">Back to Papers</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/ai-papers" className="hover:text-foreground">AI Papers</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{paper.title}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground font-serif truncate max-w-lg">{paper.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px]">{paper.paper_type.replace("_", " ")}</Badge>
              <Badge variant="secondary" className="text-[10px]">{paper.citation_style}</Badge>
              {paper.target_journal && <Badge variant="outline" className="text-[10px]">{paper.target_journal}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast.success("Export coming soon")}>
              <Download className="h-3 w-3" /> Export
            </Button>
            <Link to="/dashboard/publishing/submit">
              <Button size="sm" variant="afrika" className="gap-1 text-xs">
                <Send className="h-3 w-3" /> Submit to Journal
              </Button>
            </Link>
          </div>
        </div>

        {/* Three-panel layout */}
        <div className="grid grid-cols-12 gap-3" style={{ height: "calc(100vh - 220px)" }}>
          {/* LEFT — Paper Outline */}
          <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Outline</h3>
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-0.5">
                {paper.sections.map((s, i) => (
                  <button key={s} onClick={() => switchSection(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeSection === s
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}>
                    <span className="text-[10px] text-muted-foreground/60 mr-1.5">{i + 1}.</span>
                    {s}
                  </button>
                ))}
              </div>
              {showAddSection ? (
                <div className="mt-2 space-y-1.5 px-1">
                  <Input value={newSection} onChange={e => setNewSection(e.target.value)}
                    placeholder="Section name" className="text-xs h-7" autoFocus
                    onKeyDown={e => e.key === "Enter" && addNewSection()} />
                  <div className="flex gap-1">
                    <Button size="sm" variant="afrika" className="h-6 text-[10px] flex-1" onClick={addNewSection}>Add</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setShowAddSection(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="w-full mt-2 text-xs gap-1 text-muted-foreground"
                  onClick={() => setShowAddSection(true)}>
                  <Plus className="h-3 w-3" /> Add Section
                </Button>
              )}
            </ScrollArea>
          </div>

          {/* CENTER — Writing Editor */}
          <div className="col-span-6 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            {/* Editor toolbar */}
            <div className="p-2 border-b border-border flex items-center gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" disabled={generating}
                onClick={() => handleAIAction(activeSection === "Abstract" ? "generate_abstract" : "generate_section")}>
                {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Generate
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" disabled={generating || !editorContent}
                onClick={() => handleAIAction("expand_section")}>
                <Maximize2 className="h-3 w-3" /> Expand
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" disabled={generating || !editorContent}
                onClick={() => handleAIAction("rewrite_section")}>
                <Wand2 className="h-3 w-3" /> Rewrite
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" disabled={generating || !editorContent}
                onClick={() => handleAIAction("simplify")}>
                <Type className="h-3 w-3" /> Simplify
              </Button>
              <div className="flex-1" />
              <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1"
                onClick={() => { saveContent(activeSection, editorContent); toast.success("Saved"); }}>
                <Save className="h-3 w-3" /> Save
              </Button>
            </div>

            {/* Section heading */}
            <div className="px-6 pt-4 pb-2">
              <h2 className="text-lg font-bold text-foreground font-serif">{activeSection}</h2>
            </div>

            {/* Editor */}
            <div className="flex-1 px-6 pb-4">
              <Textarea
                value={editorContent}
                onChange={e => {
                  setEditorContent(e.target.value);
                  saveContent(activeSection, e.target.value);
                }}
                placeholder={`Start writing your ${activeSection} section, or click "Generate" to let AI help...`}
                className="h-full min-h-0 resize-none border-0 shadow-none focus-visible:ring-0 text-sm leading-relaxed font-serif"
              />
            </div>
          </div>

          {/* RIGHT — AI Assistant / Sources / Citations */}
          <div className="col-span-4 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <Tabs value={rightTab} onValueChange={setRightTab} className="flex flex-col h-full">
              <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
                <TabsTrigger value="assistant" className="flex-1 rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-accent">
                  <MessageCircle className="h-3 w-3 mr-1" /> Assistant
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex-1 rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-accent">
                  <Search className="h-3 w-3 mr-1" /> Sources
                </TabsTrigger>
                <TabsTrigger value="citations" className="flex-1 rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-accent">
                  <BookMarked className="h-3 w-3 mr-1" /> Citations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="assistant" className="flex-1 mt-0 overflow-hidden">
                <AIAssistantPanel paper={paper} />
              </TabsContent>
              <TabsContent value="sources" className="flex-1 mt-0 overflow-hidden">
                <SourcesPanel paper={paper} onAddSource={handleAddSource} />
              </TabsContent>
              <TabsContent value="citations" className="flex-1 mt-0 overflow-hidden">
                <CitationPanel paper={paper} onUpdateSources={handleUpdateSources} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaperWorkspace;
