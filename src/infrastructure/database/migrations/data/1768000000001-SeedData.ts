import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedData1768000000001 implements MigrationInterface {
    name = 'SeedData1768000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- SEED APPS ---
        const apps = [
            // Row 1
            { id: 1, url: 'https://google.com', category: 'Tools', order: 1, icon: 'https://www.google.com/favicon.ico', 
              name: { en: 'Google', 'zh-TW': 'Google', 'zh-CN': 'Google' },
              desc: { en: 'Search engine', 'zh-TW': '全球搜尋引擎', 'zh-CN': '全球搜索引擎' } 
            },
            { id: 13, url: 'https://www.youtube.com', category: 'Entertainment', order: 2, icon: 'https://www.youtube.com/favicon.ico',
              name: { en: 'YouTube', 'zh-TW': 'YouTube', 'zh-CN': 'YouTube' },
              desc: { en: 'Video streaming', 'zh-TW': '影音串流平台', 'zh-CN': '视频流媒体' }
            },
            { id: 34, url: 'https://www.facebook.com', category: 'Social', order: 3, icon: 'https://www.facebook.com/favicon.ico',
              name: { en: 'Facebook', 'zh-TW': 'Facebook', 'zh-CN': 'Facebook' },
              desc: { en: 'Social Network', 'zh-TW': '社群網站', 'zh-CN': '社交网络' }
            },
            
            // Row 2
            { id: 22, url: 'https://www.instagram.com', category: 'Entertainment', order: 4, icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
              name: { en: 'Instagram', 'zh-TW': 'Instagram', 'zh-CN': 'Instagram' },
              desc: { en: 'Photo sharing', 'zh-TW': '社群照片分享', 'zh-CN': '社交照片分享' }
            },
            { id: 21, url: 'https://twitter.com', category: 'Social', order: 5, icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
              name: { en: 'X (Twitter)', 'zh-TW': 'X (Twitter)', 'zh-CN': 'X (Twitter)' },
              desc: { en: 'Social Media', 'zh-TW': '社群媒體', 'zh-CN': '社交媒体' }
            },
            { id: 11, url: 'https://chat.openai.com', category: 'AI', order: 6, icon: 'https://chat.openai.com/favicon.ico',
              name: { en: 'ChatGPT', 'zh-TW': 'ChatGPT', 'zh-CN': 'ChatGPT' },
              desc: { en: 'AI Assistant', 'zh-TW': 'AI 助理', 'zh-CN': 'AI 助手' }
            },

            // Row 3
            { id: 20, url: 'https://www.reddit.com', category: 'Entertainment', order: 7, icon: 'https://www.reddit.com/favicon.ico',
              name: { en: 'Reddit', 'zh-TW': 'Reddit', 'zh-CN': 'Reddit' },
              desc: { en: 'Community', 'zh-TW': '社群論壇', 'zh-CN': '社区论坛' }
            },
            { id: 24, url: 'https://draw.turtle-hub.com', category: 'Tools', order: 8, icon: '/icons/poker-card.png',
              name: { en: 'Turtle Draw', 'zh-TW': 'Turtle Draw', 'zh-CN': 'Turtle Draw' },
              desc: { en: 'Drawing Tool', 'zh-TW': '繪圖工具', 'zh-CN': '绘图工具' }
            },
            { id: 9, url: 'https://www.netflix.com/browse', category: 'Entertainment', order: 9, icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
              name: { en: 'Netflix', 'zh-TW': 'Netflix', 'zh-CN': 'Netflix' },
              desc: { en: 'Streaming', 'zh-TW': '串流影音', 'zh-CN': '流媒体' }
            },

            // Row 4
            { id: 31, url: 'https://gemini.google.com', category: 'AI', order: 10, icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
              name: { en: 'Gemini', 'zh-TW': 'Gemini', 'zh-CN': 'Gemini' },
              desc: { en: 'Google AI', 'zh-TW': 'Google AI', 'zh-CN': 'Google AI' }
            },
            { id: 16, url: 'https://www.canva.com', category: 'Design', order: 11, icon: 'https://www.canva.com/favicon.ico',
              name: { en: 'Canva', 'zh-TW': 'Canva', 'zh-CN': 'Canva' },
              desc: { en: 'Design Tool', 'zh-TW': '設計工具', 'zh-CN': '设计工具' }
            },
            { id: 8, url: 'http://open.spotify.com', category: 'Entertainment', order: 12, icon: 'https://open.spotify.com/favicon.ico',
              name: { en: 'Spotify', 'zh-TW': 'Spotify', 'zh-CN': 'Spotify' },
              desc: { en: 'Music', 'zh-TW': '音樂', 'zh-CN': '音乐' }
            },

            // Row 5
            { id: 2, url: 'https://github.com', category: 'Development', order: 13, icon: 'https://github.com/favicon.ico',
              name: { en: 'GitHub', 'zh-TW': 'GitHub', 'zh-CN': 'GitHub' },
              desc: { en: 'Code Hosting', 'zh-TW': '程式碼託管', 'zh-CN': '代码托管' }
            },
            { id: 25, url: 'https://shell.turtle-hub.com', category: 'Development', order: 14, icon: '/icons/turtle-shell.png',
              name: { en: 'Turtle Shell', 'zh-TW': 'Turtle Shell', 'zh-CN': 'Turtle Shell' },
              desc: { en: 'Terminal', 'zh-TW': '終端機', 'zh-CN': '终端机' }
            },
            { id: 6, url: 'https://zoom.us/join', category: 'Social', order: 15, icon: 'https://www.google.com/s2/favicons?domain=zoom.us&sz=128',
              name: { en: 'Zoom', 'zh-TW': 'Zoom', 'zh-CN': 'Zoom' },
              desc: { en: 'Video Call', 'zh-TW': '視訊會議', 'zh-CN': '视频会议' }
            },

            // Row 6
            { id: 4, url: 'https://mail.google.com', category: 'Social', order: 16, icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
              name: { en: 'Gmail', 'zh-TW': 'Gmail', 'zh-CN': 'Gmail' },
              desc: { en: 'Email', 'zh-TW': '電子郵件', 'zh-CN': '电子邮件' }
            },
            { id: 18, url: 'https://drive.google.com', category: 'Tools', order: 17, icon: 'https://drive.google.com/favicon.ico',
              name: { en: 'Google Drive', 'zh-TW': 'Google 雲端硬碟', 'zh-CN': 'Google 云端硬盘' },
              desc: { en: 'Cloud Storage', 'zh-TW': '雲端儲存', 'zh-CN': '云端存储' }
            },
            { id: 26, url: 'https://docs.google.com', category: 'Productivity', order: 18, icon: 'https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png',
              name: { en: 'Google Docs', 'zh-TW': 'Google 文件', 'zh-CN': 'Google 文档' },
              desc: { en: 'Documents', 'zh-TW': '線上文件', 'zh-CN': '在线文档' }
            },

            // Row 7
            { id: 27, url: 'https://sheets.google.com', category: 'Productivity', order: 19, icon: 'https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png',
              name: { en: 'Google Sheets', 'zh-TW': 'Google 試算表', 'zh-CN': 'Google 表格' },
              desc: { en: 'Spreadsheets', 'zh-TW': '線上試算表', 'zh-CN': '在线表格' }
            },
            { id: 28, url: 'https://slides.google.com', category: 'Productivity', order: 20, icon: 'https://www.gstatic.com/images/branding/product/1x/slides_2020q4_48dp.png',
              name: { en: 'Google Slides', 'zh-TW': 'Google 簡報', 'zh-CN': 'Google 幻灯片' },
              desc: { en: 'Presentations', 'zh-TW': '線上簡報', 'zh-CN': '在线演示' }
            },
            { id: 23, url: 'https://meet.google.com', category: 'Social', order: 21, icon: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_1x_web_512dp.png',
              name: { en: 'Google Meet', 'zh-TW': 'Google Meet', 'zh-CN': 'Google Meet' },
              desc: { en: 'Video Meetings', 'zh-TW': '視訊會議', 'zh-CN': '视频会议' }
            },

            // Row 8
            { id: 10, url: 'https://www.figma.com', category: 'Design', order: 22, icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
              name: { en: 'Figma', 'zh-TW': 'Figma', 'zh-CN': 'Figma' },
              desc: { en: 'Design Collaboration', 'zh-TW': '設計協作', 'zh-CN': '设计协作' }
            },
            { id: 3, url: 'https://notion.so', category: 'Productivity', order: 26, icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
              name: { en: 'Notion', 'zh-TW': 'Notion', 'zh-CN': 'Notion' },
              desc: { en: 'Notes', 'zh-TW': '筆記', 'zh-CN': '笔记' }
            },
            { id: 5, url: 'https://app.slack.com/client', category: 'Social', order: 24, icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
              name: { en: 'Slack', 'zh-TW': 'Slack', 'zh-CN': 'Slack' },
              desc: { en: 'Team Chat', 'zh-TW': '團隊通訊', 'zh-CN': '团队通讯' }
            },

            // Row 9
            { id: 12, url: 'https://claude.ai', category: 'AI', order: 25, icon: 'https://claude.ai/favicon.ico',
              name: { en: 'Claude', 'zh-TW': 'Claude', 'zh-CN': 'Claude' },
              desc: { en: 'AI Assistant', 'zh-TW': 'AI 助理', 'zh-CN': 'AI 助手' }
            },
            { id: 7, url: 'https://trello.com', category: 'Productivity', order: 27, icon: 'https://trello.com/favicon.ico',
              name: { en: 'Trello', 'zh-TW': 'Trello', 'zh-CN': 'Trello' },
              desc: { en: 'Project Management', 'zh-TW': '專案管理', 'zh-CN': '项目管理' }
            },
            { id: 30, url: 'https://console.cloud.google.com', category: 'Cloud', order: 28, icon: '/icons/gcp.png',
              name: { en: 'Google Cloud', 'zh-TW': 'Google Cloud', 'zh-CN': 'Google Cloud' },
              desc: { en: 'GCP Console', 'zh-TW': 'GCP 控制台', 'zh-CN': 'GCP 控制台' }
            },

            // Row 10
            { id: 33, url: 'https://aws.amazon.com/console', category: 'Cloud', order: 29, icon: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
              name: { en: 'AWS', 'zh-TW': 'AWS', 'zh-CN': 'AWS' },
              desc: { en: 'AWS Console', 'zh-TW': 'AWS 控制台', 'zh-CN': 'AWS 控制台' }
            },
            { id: 32, url: 'https://www.google.com/maps', category: 'Tools', order: 30, icon: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
              name: { en: 'Google Maps', 'zh-TW': 'Google 地圖', 'zh-CN': 'Google 地图' },
              desc: { en: 'Maps', 'zh-TW': '地圖', 'zh-CN': '地图' }
            },
            { id: 35, url: 'https://www.atlassian.com/software/jira', category: 'Productivity', order: 31, icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg',
              name: { en: 'Jira', 'zh-TW': 'Jira', 'zh-CN': 'Jira' },
              desc: { en: 'Issue Tracking', 'zh-TW': '問題追蹤', 'zh-CN': '问题追踪' }
            },

            // Row 11
            { id: 15, url: 'https://miro.com', category: 'Design', order: 32, icon: 'https://www.google.com/s2/favicons?domain=miro.com&sz=128',
              name: { en: 'Miro', 'zh-TW': 'Miro', 'zh-CN': 'Miro' },
              desc: { en: 'Whiteboard', 'zh-TW': '白板', 'zh-CN': '白板' }
            },
            { id: 19, url: 'https://vercel.com', category: 'Development', order: 33, icon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png', 
              name: { en: 'Vercel', 'zh-TW': 'Vercel', 'zh-CN': 'Vercel' },
              desc: { en: 'Deployment', 'zh-TW': '部署平台', 'zh-CN': '部署平台' }
            }
        ];

        for (const app of apps) {
            await queryRunner.query(
                `INSERT INTO apps (id, url, category, iconUrl, \`order\`, isGlobalDefault) VALUES (?, ?, ?, ?, ?, 0)`,
                [app.id, app.url, app.category, app.icon, app.order]
            );

            await queryRunner.query(
                `INSERT INTO app_translations (appId, lang, name, description) VALUES 
                (?, 'en', ?, ?),
                (?, 'zh-TW', ?, ?),
                (?, 'zh-CN', ?, ?)`,
                [app.id, app.name.en, app.desc.en,
                 app.id, app.name['zh-TW'], app.desc['zh-TW'],
                 app.id, app.name['zh-CN'], app.desc['zh-CN']]
            );
        }

        // --- SEED TEMPLATES ---
        const templates = [
            {
                key: "engineer",
                appIds: [2, 25, 11, 31, 12, 19, 30, 33, 35, 5, 23, 3, 26, 27],
                icon: "Code", 
                trans: {
                    "en": { name: "Engineer", desc: "Development & Cloud Tools" },
                    "zh-TW": { name: "工程師", desc: "程式開發與雲端工具" },
                    "zh-CN": { name: "工程师", desc: "程序开发与云端工具" }
                }
            },
            {
                key: "designer",
                appIds: [10, 15, 16, 24, 3, 18, 26, 28, 29, 5, 23, 11, 31],
                icon: "Layout",
                trans: {
                    "en": { name: "Designer", desc: "UI/UX & Design Tools" },
                    "zh-TW": { name: "設計師", desc: "UI/UX 與平面設計工具" },
                    "zh-CN": { name: "设计师", desc: "UI/UX 与平面设计工具" }
                }
            },
            {
                key: "life",
                appIds: [13, 9, 8, 24, 22, 20, 21, 14, 32, 29, 11],
                icon: "Coffee",
                trans: {
                    "en": { name: "Life", desc: "Entertainment & Social" },
                    "zh-TW": { name: "生活娛樂", desc: "休閒娛樂與社群" },
                    "zh-CN": { name: "生活娱乐", desc: "休闲娱乐与社群" }
                }
            },
            {
                key: "productivity",
                appIds: [4, 17, 18, 26, 27, 28, 23, 3, 7, 35, 5, 11, 31, 24],
                icon: "CheckSquare",
                trans: {
                    "en": { name: "Productivity", desc: "Docs, Schedule & Tasks" },
                    "zh-TW": { name: "生產力", desc: "文件、排程與任務管理" },
                    "zh-CN": { name: "生产力", desc: "文件、排程与任务管理" }
                }
            }
        ];

        // Valid App IDs from the apps list above
        const validAppIds = new Set(apps.map(a => a.id));

        for (const tmpl of templates) {
             // Filter appIds
            const filteredAppIds = tmpl.appIds.filter(id => validAppIds.has(id));
            const jsonAppIds = JSON.stringify(filteredAppIds);

            // Use 'icon' from app object (wait, templates don't have icon populated locally in frontend assets yet, using placeholders or emojis might be better if no files?)
            // User said "also no default icon".
            // I'll assume I can just store a string.
            // But wait, the previous code didn't insert icon column.
            
            const res = await queryRunner.query(`INSERT INTO workspace_templates (appIds, icon) VALUES (?, ?)`, [jsonAppIds, tmpl.icon || null]);
            const templateId = res.insertId;

            // Insert Translations
            const langs = ['en', 'zh-TW', 'zh-CN'] as const;
            for (const lang of langs) {
                const t = tmpl.trans[lang];
                await queryRunner.query(
                    `INSERT INTO workspace_template_translations (workspaceTemplateId, lang, name, description) 
                     VALUES (?, ?, ?, ?)`,
                    [templateId, lang, t.name, t.desc]
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM workspace_template_translations`);
        await queryRunner.query(`DELETE FROM workspace_templates`);
        await queryRunner.query(`DELETE FROM app_translations`);
        await queryRunner.query(`DELETE FROM apps`);
    }
}
