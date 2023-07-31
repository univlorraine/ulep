import { Controller, Get, Res } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetProfilesUsecase } from 'src/core/usecases/profiles/get-profiles.usecase';

@Controller('export')
@Swagger.ApiExcludeController()
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
        firstname: item.user.firstname,
        lastname: item.user.lastname,
        university: item.user.university.name,
        age: item.user.age,
        gender: item.user.gender,
        role: item.role,
        native_language: item.languages.native.code,
        learning_language: item.languages.learning?.code,
        level: item.languages.learning?.level,
        // goal: item.preferences.goals.map((g) => g.name.content).join(', '),
        interests: item.interests.map((i) => i.name.content).join(', '),
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
