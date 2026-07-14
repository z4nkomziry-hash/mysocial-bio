import { DashboardLayout } from "@/layouts/DashboardLayout";
import { 
  useGetPages, 
  useGetBlocks, 
  useCreateBlock, 
  useUpdateBlock, 
  useDeleteBlock, 
  useReorderBlocks,
  useGetLinks,
  useCreateLink,
  useUpdateLink,
  useDeleteLink,
  BlockType
} from "@workspace/api-client-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  GripVertical, 
  Plus, 
  Type, 
  Link2, 
  MessageSquare, 
  Users, 
  ShoppingBag, 
  Trash2, 
  Eye, 
  EyeOff,
  Edit2,
  Check,
  X,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const BLOCK_TYPES = [
  { id: BlockType.links, label: "لینکەکان", icon: Link2, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: BlockType.header, label: "سەردێڕ", icon: Type, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: BlockType.text, label: "دەق", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
  { id: BlockType.follower_count, label: "ژمارەی شوێنکەوتوو", icon: Users, color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: BlockType.contact_form, label: "فۆرمی پەیوەندی", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: BlockType.digital_products, label: "بەرهەمی دیجیتاڵ", icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function LinkInBio() {
  const { data: pages, isLoading: pagesLoading } = useGetPages();
  const page = pages?.[0]; // Get the default home page
  
  const { data: blocks, isLoading: blocksLoading } = useGetBlocks(page?.id || 0, {
    query: { enabled: !!page?.id }
  });
  
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreateBlock = (type: BlockType) => {
    if (!page) return;
    
    let defaultTitle = "";
    if (type === BlockType.links) defaultTitle = "لینکەکان";
    if (type === BlockType.header) defaultTitle = "سەردێڕ";
    if (type === BlockType.text) defaultTitle = "دەق";
    
    createBlock.mutate(
      { 
        data: { 
          type, 
          title: defaultTitle,
          isVisible: true
        } 
      },
      {
        onSuccess: () => {
          setIsSheetOpen(false);
          toast({ title: "بلۆک زیادکرا", description: "بە سەرکەوتوویی بلۆکێکی نوێ زیادکرا." });
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${page.id}/blocks`] });
        }
      }
    );
  };

  const handleToggleVisibility = (blockId: number, currentVisibility: boolean) => {
    updateBlock.mutate(
      { 
        id: blockId, 
        data: { isVisible: !currentVisibility } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${page!.id}/blocks`] });
        }
      }
    );
  };

  const handleDeleteBlock = (blockId: number) => {
    if (confirm("دڵنیایت لە سڕینەوەی ئەم بلۆکە؟")) {
      deleteBlock.mutate(
        { id: blockId },
        {
          onSuccess: () => {
            toast({ title: "سڕایەوە", description: "بلۆکەکە بە سەرکەوتوویی سڕایەوە." });
            queryClient.invalidateQueries({ queryKey: [`/api/pages/${page!.id}/blocks`] });
          }
        }
      );
    }
  };

  if (pagesLoading || (page && blocksLoading)) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لینکی بیو</h1>
          <p className="text-muted-foreground mt-2">ڕێکخستن و بەڕێوەبردنی پێکهاتەکانی پەڕەکەت.</p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full shadow-md gap-2" size="lg">
              <Plus size={20} />
              بلۆک زیادبکە
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] sm:h-auto sm:side-right rounded-t-3xl sm:rounded-none">
            <SheetHeader className="text-right pb-4 border-b">
              <SheetTitle>بلۆکێکی نوێ زیاد بکە</SheetTitle>
              <SheetDescription>پێکهاتەیەکی نوێ هەڵبژێرە بۆ زیادکردنی لە پرۆفایلەکەت.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4 py-6">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleCreateBlock(type.id as BlockType)}
                  className="flex flex-col items-center justify-center p-4 border rounded-2xl hover:border-primary hover:bg-muted/30 transition-all gap-3"
                >
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
        {blocks && blocks.length > 0 ? (
          blocks.sort((a, b) => a.blockOrder - b.blockOrder).map((block) => (
            <Card key={block.id} className={`shadow-sm border-border/50 overflow-hidden ${!block.isVisible ? 'opacity-60' : ''}`}>
              <div className="flex items-center p-1 bg-muted/20 border-b border-border/50">
                <div className="p-3 text-muted-foreground cursor-grab hover:text-foreground">
                  <GripVertical size={18} />
                </div>
                
                <div className="flex-1 flex items-center gap-2 px-2">
                  <span className="font-medium text-sm truncate">{block.title || "بێ سەردێڕ"}</span>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {BLOCK_TYPES.find(t => t.id === block.type)?.label || block.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 px-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleToggleVisibility(block.id, block.isVisible)}
                  >
                    {block.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteBlock(block.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4 sm:p-6">
                {block.type === BlockType.links ? (
                  <LinksEditor block={block} pageId={page!.id} />
                ) : block.type === BlockType.header ? (
                  <HeaderEditor block={block} pageId={page!.id} />
                ) : block.type === BlockType.text ? (
                  <TextEditor block={block} pageId={page!.id} />
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    ئەم پێکهاتەیە بەمزوانە بەردەست دەبێت
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 bg-card border border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">پرۆفایلەکەت بەتاڵە</h3>
            <p className="text-muted-foreground mb-6">
              دەستپێبکە بە زیادکردنی بلۆکەکان بۆ دروستکردنی پەڕەیەکی جوان.
            </p>
            <Button onClick={() => setIsSheetOpen(true)}>
              یەکەم بلۆک زیادبکە
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Sub-components for specific block types

function LinksEditor({ block, pageId }: { block: any, pageId: number }) {
  const { data: links, isLoading } = useGetLinks({ query: { enabled: !!block.id } });
  const blockLinks = links?.filter(l => l.blockId === block.id) || [];
  
  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();
  const queryClient = useQueryClient();
  
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLink = () => {
    if (!newTitle || !newUrl) return;
    
    // Ensure URL has protocol
    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    
    createLink.mutate(
      { data: { blockId: block.id, title: newTitle, url } },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewUrl("");
          setIsAdding(false);
          queryClient.invalidateQueries({ queryKey: [`/api/links`] });
        }
      }
    );
  };

  const handleDeleteLink = (linkId: number) => {
    deleteLink.mutate(
      { id: linkId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [`/api/links`] });
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      {blockLinks.length > 0 ? (
        <div className="space-y-3">
          {blockLinks.sort((a, b) => a.linkOrder - b.linkOrder).map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 border rounded-xl bg-background">
              <div className="p-2 bg-muted rounded-lg text-muted-foreground cursor-grab">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{link.title}</p>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">{link.url}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive/70 hover:text-destructive"
                onClick={() => handleDeleteLink(link.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {isAdding ? (
        <div className="p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">سەردێڕی لینک</Label>
            <Input 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              placeholder="نموونە: ماڵپەڕەکەم" 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">بەستەر (URL)</Label>
            <Input 
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)} 
              placeholder="https://example.com" 
              dir="ltr" 
              className="text-left"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleAddLink} disabled={!newTitle || !newUrl}>
              پاشکەوتکردن
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              پاشگەزبوونەوە
            </Button>
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

function HeaderEditor({ block, pageId }: { block: any, pageId: number }) {
  const updateBlock = useUpdateBlock();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(block.title || "");
  const [content, setContent] = useState(block.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateBlock.mutate(
      { id: block.id, data: { title, content } },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}/blocks`] });
        }
      }
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>سەردێڕ</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>دەقی ژێر سەردێڕ</Label>
          <Input value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>پاشکەوتکردن</Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>پاشگەزبوونەوە</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-4 border border-transparent hover:border-border rounded-xl">
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
          <Edit2 size={14} />
        </Button>
      </div>
      <h2 className="text-xl font-bold text-center">{title || "سەردێڕ"}</h2>
      {content && <p className="text-muted-foreground text-center mt-2">{content}</p>}
    </div>
  );
}

function TextEditor({ block, pageId }: { block: any, pageId: number }) {
  const updateBlock = useUpdateBlock();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(block.title || "");
  const [content, setContent] = useState(block.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateBlock.mutate(
      { id: block.id, data: { title, content } },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: [`/api/pages/${pageId}/blocks`] });
        }
      }
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>سەردێڕ (ئارەزوومەندانە)</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>دەق</Label>
          <Textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            className="h-24 resize-none"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>پاشکەوتکردن</Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>پاشگەزبوونەوە</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-4 border border-transparent hover:border-border rounded-xl">
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
          <Edit2 size={14} />
        </Button>
      </div>
      {title && <h3 className="font-bold mb-2 text-center">{title}</h3>}
      <p className="text-muted-foreground text-center whitespace-pre-wrap">
        {content || "دەقێک بنووسە لێرەدا..."}
      </p>
    </div>
  );
}
