import { Controller, Get, Res } from '@nestjs/common';
import { GetProfilesUsecase } from 'src/core/usecases/profiles/get-profiles.usecase';

@Controller('export')
export class ExportController {
  constructor(private readonly getProfilesUsecase: GetProfilesUsecase) {}

  @Get('profiles')
  async profiles(@Res() response: any): Promise<any> {
    const data = await this.getProfilesUsecase.execute({
      page: 1,
      limit: 1500,
    });

    const rows: any[] = [];
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      const row = {
        id: i + 1,
        firstname: item.firstname,
        lastname: item.lastname,
        university: item.university.name,
        age: item.age,
        gender: item.gender,
        role: item.role,
        native_language: item.nativeLanguage.code,
        learning_language: item.learningLanguage.code,
        level: item.learningLanguage.level,
        goal: Array.from(item.goals).join(','),
        interests: Array.from(item.interests).join(','),
        same_gender: item.preferences.sameGender ? 1 : 0,
        meeting_frequency: item.preferences.meetingFrequency,
      };

      rows.push(row);
    }

    const csvData = this.jsonToCsv(rows);

    response.header('Content-Type', 'text/csv');
    response.attachment('profiles.csv');
    response.send(csvData);
  }

  private jsonToCsv(jsonData: any[]): string {
    if (jsonData.length === 0) return '';

    const headers = Object.keys(jsonData[0]).join(';');

    const data = jsonData.map((row) => Object.values(row).join(';')).join('\n');

    const csvData = `${headers}\n${data}`;

    return csvData;
  }
}
