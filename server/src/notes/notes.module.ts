import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { NoteFolder } from './entities/note-folder.entity';
import { NoteTag } from './entities/note-tag.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Note, NoteFolder, NoteTag, User])],
    controllers: [NotesController],
    providers: [NotesService],
})
export class NotesModule { }
