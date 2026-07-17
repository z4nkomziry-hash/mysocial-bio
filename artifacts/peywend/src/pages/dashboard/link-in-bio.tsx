import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  useGetPages, useGetBlocks, useCreateBlock, useUpdateBlock,
  useDeleteBlock, useReorderBlocks, useGetLinks, useCreateLink,
  useUpdateLink, useDeleteLink, BlockType,
} from "@workspace/api-client-react";
import { customFetch } from "@workspace/api-client-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  GripVertical, Plus, Type, Link2, MessageSquare, Users,
  ShoppingBag, Trash2, Eye, EyeOff, Edit2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BLOCK_TYPES = [
  { id: BlockType.links,           label: "لینکەکان",         icon: Link2,        color: "text-blue-500",    bg: "bg-blue-500/10" },
  { id: BlockType.header,          label: "سەردێڕ",           icon: Type,         color: "text-purple-500",  bg: "bg-purple-500/10" },
  { id: BlockType.text,            label: "دەق",               icon: MessageSquare,color: "text-green-500",   bg: "bg-green-500/10" },
  { id: BlockType.follower_count,  label: "ژمارەی شوێنکەوتوو",icon: Users,        color: "text-pink-500",    bg: "bg-pink-500/10" },
  { id: BlockType.contact_form,    label: "فۆرمی پەیوەندی",   icon: MessageSquare,color: "text-orange-500",  bg: "bg-orange-500/10" },
  { id: BlockType.digital_products,label: "بەرهەمی دیجیتاڵ",  icon: ShoppingBag,  color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

// ── Sortable block wrapper ────────────────────────────────────────────────
function SortableBlock({ block, onToggle, onDelete, pageId }: {
  block: any; onToggle: () => void; onDelete: () => void; pageId: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style as any}>
      <Card className={`shadow-sm border-border/50 overflow-hidden ${!block.isVisible ? "opacity-60" : ""}`}>
        <div className="flex items-center p-1 bg-muted/20 border-b border-border/50">
          <button
            className="p-3 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            {...attributes} {...listeners}
          >
            <GripVertical size={18} />
          </button>

          <div className="flex-1 flex items-center gap-2 px-2">
            <span className="font-medium text-sm truncate">{block.title || "بێ سەردێڕ"}</span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {BLOCK_TYPES.find(t => t.id === block.type)?.label || block.type}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onToggle}>
              {block.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          {block.type === BlockType.links   ? <LinksEditor block={block} pageId={pageId} /> :
           block.type === BlockType.header  ? <HeaderEditor block={block} pageId={pageId} /> :
           block.type === BlockType.text    ? <TextEditor block={block} pageId={pageId} /> :
           <div className="text-center py-4 text-sm text-muted-foreground">ئەم پێکهاتەیە بەمزوانە بەردەست دەبێت</div>
          }
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function LinkInBio() {
  const { data: pages, isLoading: pagesLoading } = useGetPages();
  const page = pages?.[0];

  const { data: blocks, isLoading: blocksLoading } = useGetBlocks(page?.id || 0, {
    query: { queryKey: [`/api/pages/${page?.id}/blocks`], enabled: !!page?.id }
  });

  const createBlock    = useCreateBlock();
  const updateBlock    = useUpdateBlock();
  const deleteBlock    = useDeleteBlock();
  const reorderBlocks  = useReorderBlocks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const sorted = blocks ? [...blocks].sort((a, b) => a.blockOrder - b.blockOrder) : [];

  const handleBlockDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = sorted.findIndex(b => b.id === active.id);
    const newIdx = sorted.findIndex(b => b.id === over.id);
    const reordered = arrayMove(sorted, oldIdx, newIdx);

    reorderBlocks.mutate(
      { data: { items: reordered.map((b, i) => ({ id: b.id, blockOrder: i })) } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/pages/${page!.id}/blocks`] }) }
    );
  };

  const handleCreateBlock = (type: BlockType) => {
    if (!page) return;
    const defaultTitle = type === BlockType.links ? "لینکەکان" : type === BlockType.header ? "سەردێڕ" : type === BlockType.text ? "دەق" : "";
    createBlock.mutate(
      { pageId: page.id, data: { type, title: defaultTitle, isVisible: true } },
      {
        onSuccess: () => {
          setIsSheetOpen(false);
          toast({ title: "بلۆک زیادکرا" });
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${page.id}/blocks`] });
        }
      }
    );
  };

  const handleToggle = (blockId: number, cur: boolean) => {
    updateBlock.mutate(
      { id: blockId, data: { isVisible: !cur } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/pages/${page!.id}/blocks`] }) }
    );
  };

  const handleDelete = (blockId: number) => {
    if (!confirm("دڵنیایت لە سڕینەوەی ئەم بلۆکە؟")) return;
    deleteBlock.mutate(
      { id: blockId },
      {
        onSuccess: () => {
          toast({ title: "سڕایەوە" });
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${page!.id}/blocks`] });
        }
      }
    );
  };

  if (pagesLoading || (page && blocksLoading)) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-20 w-full" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">لینکی بیو</h1>
          <p className="text-muted-foreground mt-1 text-sm">ڕێکخستن و بەڕێوەبردنی پێکهاتەکانی پەڕەکەت.</p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full shadow-md gap-2" size="lg">
              <Plus size={20} />
              بلۆک زیادبکە
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] sm:h-auto rounded-t-3xl sm:rounded-none">
            <SheetHeader className="text-right pb-4 border-b">
              <SheetTitle>بلۆکێکی نوێ زیاد بکە</SheetTitle>
              <SheetDescription>پێکهاتەیەکی نوێ هەڵبژێرە.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4 py-6">
              {BLOCK_TYPES.map(type => (
                <button key={type.id} onClick={() => handleCreateBlock(type.id as BlockType)}
                  className="flex flex-col items-center justify-center p-4 border rounded-2xl hover:border-primary hover:bg-muted/30 transition-all gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type.bg} ${type.color}`}>
                    <type.icon size={24} />
                  </div>
                  <span className="font-medium text-sm text-center">{type.label}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-4 max-w-3xl">
        {sorted.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBlockDragEnd}>
            <SortableContext items={sorted.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {sorted.map(block => (
                <SortableBlock
                  key={block.id} block={block} pageId={page!.id}
                  onToggle={() => handleToggle(block.id, block.isVisible)}
                  onDelete={() => handleDelete(block.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center p-12 bg-card border border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">پرۆفایلەکەت بەتاڵە</h3>
            <p className="text-muted-foreground mb-6">دەستپێبکە بە زیادکردنی بلۆکەکان.</p>
            <Button onClick={() => setIsSheetOpen(true)}>یەکەم بلۆک زیادبکە</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ── LinksEditor (with sortable links) ────────────────────────────────────
function SortableLink({ link, onDelete }: { link: any; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 border rounded-xl bg-background">
      <button className="p-1.5 bg-muted rounded-lg text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
        {...attributes} {...listeners}>
        <GripVertical size={16} />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{link.title}</p>
        <p className="text-xs text-muted-foreground truncate" dir="ltr">{link.url}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive shrink-0" onClick={onDelete}>
        <Trash2 size={16} />
      </Button>
    </div>
  );
}

function LinksEditor({ block, pageId }: { block: any; pageId: number }) {
  const { data: links, isLoading } = useGetLinks({ blockId: block.id }, { query: { queryKey: ["/api/links", block.id], enabled: !!block.id } });
  const blockLinks = [...(links || [])].sort((a, b) => a.linkOrder - b.linkOrder);

  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl]   = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newTitle || !newUrl) return;
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    createLink.mutate(
      { data: { blockId: block.id, title: newTitle, url } },
      { onSuccess: () => { setNewTitle(""); setNewUrl(""); setIsAdding(false); queryClient.invalidateQueries({ queryKey: ["/api/links"] }); } }
    );
  };

  const handleDelete = (linkId: number) => {
    deleteLink.mutate(
      { id: linkId },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/links"] }) }
    );
  };

  const handleLinkDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = blockLinks.findIndex(l => l.id === active.id);
    const newIdx = blockLinks.findIndex(l => l.id === over.id);
    const reordered = arrayMove(blockLinks, oldIdx, newIdx);

    try {
      await customFetch("/api/links/reorder", {
        method: "PUT",
        body: JSON.stringify({ items: reordered.map((l, i) => ({ id: l.id, linkOrder: i })) }),
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
    } catch { /* ignore */ }
  };

  if (isLoading) return <div className="h-10 bg-muted animate-pulse rounded-xl" />;

  return (
    <div className="space-y-4">
      {blockLinks.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
          <SortableContext items={blockLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {blockLinks.map(link => (
                <SortableLink key={link.id} link={link} onDelete={() => handleDelete(link.id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isAdding ? (
        <div className="p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">سەردێڕی لینک</Label>
            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="نموونە: ماڵپەڕەکەم" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">بەستەر (URL)</Label>
            <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com" dir="ltr" className="text-left" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleAdd} disabled={!newTitle || !newUrl || createLink.isPending}>پاشکەوتکردن</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>پاشگەزبوونەوە</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="w-full border-dashed" onClick={() => setIsAdding(true)}>
          <Plus size={16} className="mr-2" />
          زیادکردنی لینک
        </Button>
      )}
    </div>
  );
}

// ── HeaderEditor ──────────────────────────────────────────────────────────
function HeaderEditor({ block, pageId }: { block: any; pageId: number }) {
  const updateBlock = useUpdateBlock();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(block.title || "");
  const [content, setContent] = useState(block.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateBlock.mutate(
      { id: block.id, data: { title, content } },
      { onSuccess: () => { setIsEditing(false); queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}/blocks`] }); } }
    );
  };

  if (isEditing) return (
    <div className="space-y-4">
      <div className="space-y-1.5"><Label>سەردێڕ</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
      <div className="space-y-1.5"><Label>دەقی ژێر سەردێڕ</Label><Input value={content} onChange={e => setContent(e.target.value)} /></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>پاشکەوتکردن</Button>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>پاشگەزبوونەوە</Button>
      </div>
    </div>
  );

  return (
    <div className="relative group p-4 border border-transparent hover:border-border rounded-xl">
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}><Edit2 size={14} /></Button>
      </div>
      <h2 className="text-xl font-bold text-center">{title || "سەردێڕ"}</h2>
      {content && <p className="text-muted-foreground text-center mt-2">{content}</p>}
    </div>
  );
}

// ── TextEditor ────────────────────────────────────────────────────────────
function TextEditor({ block, pageId }: { block: any; pageId: number }) {
  const updateBlock = useUpdateBlock();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(block.title || "");
  const [content, setContent] = useState(block.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateBlock.mutate(
      { id: block.id, data: { title, content } },
      { onSuccess: () => { setIsEditing(false); queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}/blocks`] }); } }
    );
  };

  if (isEditing) return (
    <div className="space-y-4">
      <div className="space-y-1.5"><Label>سەردێڕ (ئارەزوومەندانە)</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
      <div className="space-y-1.5"><Label>دەق</Label><Textarea value={content} onChange={e => setContent(e.target.value)} className="h-24 resize-none" /></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>پاشکەوتکردن</Button>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>پاشگەزبوونەوە</Button>
      </div>
    </div>
  );

  return (
    <div className="relative group p-4 border border-transparent hover:border-border rounded-xl">
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}><Edit2 size={14} /></Button>
      </div>
      {title && <h3 className="font-bold mb-2 text-center">{title}</h3>}
      <p className="text-muted-foreground text-center whitespace-pre-wrap">{content || "دەقێک بنووسە لێرەدا..."}</p>
    </div>
  );
}
