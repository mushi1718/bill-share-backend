import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJaKoTranslations1768100000002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- 1. App Translations ---
        const apps = [
            { name: 'Google', ja: { n: 'Google', d: '検索エンジン' }, ko: { n: 'Google', d: '검색 엔진' } },
            { name: 'YouTube', ja: { n: 'YouTube', d: '動画ストリーミング' }, ko: { n: 'YouTube', d: '동영상 스트리밍' } },
            { name: 'Facebook', ja: { n: 'Facebook', d: 'ソーシャルネットワーク' }, ko: { n: 'Facebook', d: '소셜 네트워크' } },
            { name: 'Instagram', ja: { n: 'Instagram', d: '写真共有' }, ko: { n: 'Instagram', d: '사진 공유' } },
            { name: 'X (Twitter)', ja: { n: 'X (Twitter)', d: 'ソーシャルメディア' }, ko: { n: 'X (Twitter)', d: '소셜 미디어' } },
            { name: 'ChatGPT', ja: { n: 'ChatGPT', d: 'AIアシスタント' }, ko: { n: 'ChatGPT', d: 'AI 어시스턴트' } },
            { name: 'Reddit', ja: { n: 'Reddit', d: 'コミュニティ' }, ko: { n: 'Reddit', d: '커뮤니티' } },
            { name: 'Turtle Draw', ja: { n: 'Turtle Draw', d: 'お絵描きツール' }, ko: { n: 'Turtle Draw', d: '그리기 도구' } },
            { name: 'Netflix', ja: { n: 'Netflix', d: 'ストリーミング' }, ko: { n: 'Netflix', d: '스트리밍' } },
            { name: 'Gemini', ja: { n: 'Gemini', d: 'Google AI' }, ko: { n: 'Gemini', d: '구글 AI' } },
            { name: 'Canva', ja: { n: 'Canva', d: 'デザインツール' }, ko: { n: 'Canva', d: '디자인 도구' } },
            { name: 'Spotify', ja: { n: 'Spotify', d: '音楽' }, ko: { n: 'Spotify', d: '음악' } },
            { name: 'GitHub', ja: { n: 'GitHub', d: 'コードホスティング' }, ko: { n: 'GitHub', d: '코드 호스팅' } },
            { name: 'Turtle Shell', ja: { n: 'Turtle Shell', d: 'ターミナル' }, ko: { n: 'Turtle Shell', d: '터미널' } },
            { name: 'Zoom', ja: { n: 'Zoom', d: 'ビデオ通話' }, ko: { n: 'Zoom', d: '화상 통화' } },
            { name: 'Gmail', ja: { n: 'Gmail', d: 'メール' }, ko: { n: 'Gmail', d: '이메일' } },
            { name: 'Google Drive', ja: { n: 'Googleドライブ', d: 'クラウドストレージ' }, ko: { n: 'Google 드라이브', d: '클라우드 스토리지' } },
            { name: 'Google Docs', ja: { n: 'Googleドキュメント', d: 'ドキュメント' }, ko: { n: 'Google 문서', d: '문서' } },
            { name: 'Google Sheets', ja: { n: 'Googleスプレッドシート', d: 'スプレッドシート' }, ko: { n: 'Google 스프레드시트', d: '스프레드시트' } },
            { name: 'Google Slides', ja: { n: 'Googleスライド', d: 'プレゼンテーション' }, ko: { n: 'Google 프레젠테이션', d: '프레젠테이션' } },
            { name: 'Google Meet', ja: { n: 'Google Meet', d: 'ビデオ会議' }, ko: { n: 'Google Meet', d: '화상 회의' } },
            { name: 'Figma', ja: { n: 'Figma', d: 'デザイン協業' }, ko: { n: 'Figma', d: '디자인 협업' } },
            { name: 'Notion', ja: { n: 'Notion', d: 'メモ・ノート' }, ko: { n: 'Notion', d: '노트' } },
            { name: 'Slack', ja: { n: 'Slack', d: 'チームチャット' }, ko: { n: 'Slack', d: '팀 채팅' } },
            { name: 'Claude', ja: { n: 'Claude', d: 'AIアシスタント' }, ko: { n: 'Claude', d: 'AI 어시스턴트' } },
            { name: 'Trello', ja: { n: 'Trello', d: 'プロジェクト管理' }, ko: { n: 'Trello', d: '프로젝트 관리' } },
            { name: 'Google Cloud', ja: { n: 'Google Cloud', d: 'GCPコンソール' }, ko: { n: 'Google Cloud', d: 'GCP 콘솔' } },
            { name: 'AWS', ja: { n: 'AWS', d: 'AWSコンソール' }, ko: { n: 'AWS', d: 'AWS 콘솔' } },
            { name: 'Google Maps', ja: { n: 'Googleマップ', d: '地図' }, ko: { n: 'Google 지도', d: '지도' } },
            { name: 'Jira', ja: { n: 'Jira', d: '課題追跡' }, ko: { n: 'Jira', d: '이슈 트래킹' } },
            { name: 'Miro', ja: { n: 'Miro', d: 'ホワイトボード' }, ko: { n: 'Miro', d: '화이트보드' } },
            { name: 'Vercel', ja: { n: 'Vercel', d: 'デプロイ' }, ko: { n: 'Vercel', d: '배포' } }
        ];

        for (const app of apps) {
            // Find app by name
            const appRecords = await queryRunner.query(`SELECT id FROM apps WHERE name = ?`, [app.name]);
            if (appRecords.length > 0) {
                const appId = appRecords[0].id;
                await queryRunner.query(
                    `INSERT INTO app_trans (appId, lang, name, description) VALUES 
                    (?, 'ja', ?, ?),
                    (?, 'ko', ?, ?)`,
                    [appId, app.ja.n, app.ja.d, appId, app.ko.n, app.ko.d]
                );
            }
        }

        // --- 2. Template Translations ---
        const templates = [
            { 
                key: 'Engineer', 
                ja: { n: 'エンジニア', d: '開発＆クラウドツール' }, 
                ko: { n: '엔지니어', d: '개발 및 클라우드 도구' } 
            },
            { 
                key: 'Designer', 
                ja: { n: 'デザイナー', d: 'UI/UX＆デザインツール' }, 
                ko: { n: '디자이너', d: 'UI/UX 및 디자인 도구' } 
            },
            { 
                key: 'Life', 
                ja: { n: 'ライフ', d: '生活、エンタメ＆ソーシャル' }, 
                ko: { n: '라이프', d: '생활, 엔터테인먼트 및 소셜' } 
            },
            { 
                key: 'Productivity', 
                ja: { n: '生産性', d: 'ドキュメント、スケジュール＆タスク' }, 
                ko: { n: '생산성', d: '문서, 일정 및 작업' } 
            }
        ];

        for (const tmpl of templates) {
            // Find template by name
            const tmplRecords = await queryRunner.query(`SELECT id FROM templates WHERE name = ?`, [tmpl.key]);
            if (tmplRecords.length > 0) {
                const templateId = tmplRecords[0].id;
                await queryRunner.query(
                    `INSERT INTO templates_trans (templateId, lang, name, description) VALUES 
                    (?, 'ja', ?, ?),
                    (?, 'ko', ?, ?)`,
                    [templateId, tmpl.ja.n, tmpl.ja.d, templateId, tmpl.ko.n, tmpl.ko.d]
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM app_trans WHERE lang IN ('ja', 'ko')`);
        await queryRunner.query(`DELETE FROM templates_trans WHERE lang IN ('ja', 'ko')`);
    }

}
