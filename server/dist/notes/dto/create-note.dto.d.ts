export declare class CreateNoteFolderDto {
    name: string;
    parentId?: string;
    color?: string;
    icon?: string;
}
export declare class CreateNoteDto {
    folderId: string;
    type: 'note' | 'whiteboard' | 'document';
    title: string;
    content?: string;
    contentJson?: string;
    tags?: string[];
    isFavorite?: boolean;
}
