import { PartialType } from '@nestjs/swagger';
import { CreateListeningHistoryDto } from './create-listening-history.dto';

export class UpdateListeningHistoryDto extends PartialType(
  CreateListeningHistoryDto,
) {}
