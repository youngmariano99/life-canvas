import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    // --- Folders ---
    @Get('folders')
    findAllFolders() {
        return this.notesService.findAllFolders();
    }

    @Post('folders')
    createFolder(@Body() createDto: CreateNoteFolderDto) {
        return this.notesService.createFolder(createDto);
    }

    @Patch('folders/:id')
    updateFolder(@Param('id') id: string, @Body() updateDto: UpdateNoteFolderDto) {
        return this.notesService.updateFolder(id, updateDto);
    }

    @Delete('folders/:id')
    removeFolder(@Param('id') id: string) {
        return this.notesService.removeFolder(id);
    }

    // --- Notes ---
    @Get()
    findAllNotes() {
        return this.notesService.findAllNotes();
    }

    @Post()
    createNote(@Body() createDto: CreateNoteDto) {
        return this.notesService.createNote(createDto);
    }

    @Patch(':id')
    updateNote(@Param('id') id: string, @Body() updateDto: UpdateNoteDto) {
        return this.notesService.updateNote(id, updateDto);
    }

    @Delete(':id')
    removeNote(@Param('id') id: string) {
        return this.notesService.removeNote(id);
    }
}
