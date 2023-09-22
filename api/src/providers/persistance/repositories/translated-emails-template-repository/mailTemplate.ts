interface GetMailProps {
  title: string;
  content: {
    introduction: string;
    paragraphs: string[];
    signature: string;
  };
  footer: {
    unsubscribe: string;
    downloadApps: string;
  };
  imageUrls: {
    background: string;
    logo: string;
    bubble: string;
    playStore: string;
    appleStore: string;
  };
  links: {
    playStore: string;
    appleStore: string;
  };
}

const getMailFromTemplate = ({
  title,
  content,
  imageUrls,
  links,
  footer,
}: GetMailProps) => {
  return `<html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style lang="css">
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
            }
        
    
            h1 {
                font-size: 37px;
                line-height: 40px;
                font-weight: 700;
            }
    
            h2 {
                font-size: 17px;
                font-weight: 700;
                line-height: 21px;
                margin-bottom: 30px;
            }
    
            hr {
                margin-top: 50px;
            }
    
            .logo {
                width: 160px;
            }
    
    
            header {
                background-image: url('${imageUrls.background}');
                background-color: rgb(253, 238, 102);
                background-position: -100px top;
                background-repeat: no-repeat;
                background-size: 150%;
    
                padding: 50px;
                text-align: center;
            }
    
            header>.logo-container {
                margin-bottom: 30px;
            }
    
            header .bubble {
                width: 225px;
                margin-bottom: -50px;
            }
    
            section {
                padding: 30px;
    
                font-size: 16px;
                font-weight: 400;
                line-height: 20px;
            }
    
            section p {
                margin-bottom: 20px;
            }
    
            section .logo-container {
                text-align: center;
                margin-top: 30px;
            }
    
    
            footer {
                background-color: #000000;
                color: #ffffff;
    
                padding: 50px;
                text-align: center;
            }
    
            footer .unsubscribe-text {
                margin-bottom: 30px;
                font-size: 16px;
                font-weight: 700;
                line-height: 18.75px;
            }
    
            footer .download-apps-section {
                border: solid 1px #ffffff;
                border-radius: 10px;
                padding: 30px;

                width: fit-content;
                margin: auto;
            }
    
            footer .download-apps-section__text {
                margin-bottom: 11px;
            }
    
            footer .download-apps-section__buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
    
            footer .store-button {
                width: 180px;
            }
    
    
            @media screen and (min-width: 800px) {
                .logo {
                    width: 250px;
                }
    
                section {
                    padding: 80px;
                }
    
                section .logo-container {
                    margin-top: 50px;
                }
    
                footer .download-apps-section__buttons {
                    flex-direction: row;
                    justify-content: center;
                    gap: 50px;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <div class="logo-container">
                <img src="${imageUrls.logo}" alt="logo" class="logo">
            </div>
    
            <div class="bubble-container">
                <img src="${imageUrls.bubble}" alt="hi" class="bubble">
            </div>
    
            <h1>${title}</h1>
        </header>
        <section>
            <h2>${content.introduction}</h2>
            <div>
                ${content.paragraphs
                  .map((paragraph) => `<p>${paragraph}</p>`)
                  .join('\n')}
                <p>${content.signature}</p>
            </div>
            <hr>
            <div class="logo-container">
                <img class="logo" src="${imageUrls.logo}" alt="logo">
            </div>
        </section>
        <footer>
            <p class="unsubscribe-text">
                ${footer.unsubscribe}
            </p>
    
            <div class="download-apps-section">
                <div class="download-apps-section__text">
                    <span>${footer.downloadApps}</span>
                </div>
                <div class="download-apps-section__buttons">
                    <a href="${links.appleStore}">
                        <img src="${
                          imageUrls.appleStore
                        }" alt="apple-store" class="store-button">
                    </a>
                    <a href="${links.playStore}">
                        <img src="${
                          imageUrls.playStore
                        }" alt="play-store" class="store-button">
                    </a>
                </div>
            </div>
        </footer>
    </body>
    </html>`;
};

export default getMailFromTemplate;
