import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetProfilesUsecase } from 'src/core/usecases/profiles/get-profiles.usecase';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';

@Controller('export')
@Swagger.ApiExcludeController()
export class ExportController {
  constructor(private readonly getProfilesUsecase: GetProfilesUsecase) {}

  @Get('profiles')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
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
        role: item.user.role,
        native_language: item.nativeLanguage.code,
        learning_language: item.learningLanguages?.[0]?.language.code,
        level: item.learningLanguages?.[0]?.level,
        // goal: item.preferences.goals.map((g) => g.name.content).join(', '),
        interests: item.interests.map((i) => i.name.content).join(', '),
        meeting_frequency: item.meetingFrequency,
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
