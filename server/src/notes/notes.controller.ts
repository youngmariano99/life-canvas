import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    // --- Folders ---
    @Get('folders')
    findAllFolders(@Request() req) {
        return this.notesService.findAllFolders(req.user.id);
    }

    @Post('folders')
    createFolder(@Body() createDto: CreateNoteFolderDto, @Request() req) {
        return this.notesService.createFolder(createDto, req.user.id);
    }

    @Patch('folders/:id')
    updateFolder(@Param('id') id: string, @Body() updateDto: UpdateNoteFolderDto, @Request() req) {
        return this.notesService.updateFolder(id, updateDto, req.user.id);
    }

    @Delete('folders/:id')
    removeFolder(@Param('id') id: string, @Request() req) {
        return this.notesService.removeFolder(id, req.user.id);
    }

    // --- Notes ---
    @Get()
    findAllNotes(@Request() req) {
        return this.notesService.findAllNotes(req.user.id);
    }

    @Post()
    createNote(@Body() createDto: CreateNoteDto, @Request() req) {
        return this.notesService.createNote(createDto, req.user.id);
    }

    @Patch(':id')
    updateNote(@Param('id') id: string, @Body() updateDto: UpdateNoteDto, @Request() req) {
        return this.notesService.updateNote(id, updateDto, req.user.id);
    }

    @Delete(':id')
    removeNote(@Param('id') id: string, @Request() req) {
        return this.notesService.removeNote(id, req.user.id);
    }
}
