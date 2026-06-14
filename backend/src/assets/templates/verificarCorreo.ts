export const verificationEmailTemplate = (
    nombre: string,
    verificationUrl: string
) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de correo - ARIA</title>
</head>

<body style="margin:0;padding:0;background-color:#FCFDFB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#FCFDFB;padding:40px 20px;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="
    background:#FFFFFF;
    border:1px solid #EBF1EC;
    border-radius:16px;
    overflow:hidden;
">

        <!-- HEADER -->
        <tr>
          <td style="
            background:linear-gradient(180deg,#05682C,#143B20);
            padding:35px 30px;
            text-align:center;
        ">

            <img
                    src="cid:aria-logo"
                    alt="ARIA"
                    width="140"
                    style="display:block;margin:0 auto 20px auto;border:0;"
            >

            <h1 style="
                color:#FFFFFF;
                margin:0;
                font-size:32px;
                font-weight:bold;
                letter-spacing:1px;
            ">
              ARIA
            </h1>

            <p style="
                color:#CDE1D1;
                margin-top:12px;
                font-size:14px;
            ">
              Plataforma de Impacto Ambiental
            </p>

          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:40px;">

            <h2 style="
                color:#143B20;
                margin-top:0;
                margin-bottom:20px;
            ">
              Verifica tu correo electrónico
            </h2>

            <p style="
                color:#557B5E;
                line-height:1.7;
                font-size:15px;
            ">
              Hola <strong>${nombre}</strong>,
            </p>

            <p style="
                color:#557B5E;
                line-height:1.7;
                font-size:15px;
            ">
              Gracias por registrarte en ARIA. Para activar tu cuenta y comenzar a utilizar la plataforma, necesitamos verificar tu dirección de correo electrónico.
            </p>

            <div style="
                background:#F3FAF4;
                border:1px solid #CDE1D1;
                border-radius:12px;
                padding:18px;
                margin:25px 0;
            ">

              <p style="
                    margin:0;
                    color:#143B20;
                    line-height:1.6;
                    font-size:14px;
                ">
                🌱 Tu cuenta está casi lista. Completa este paso para acceder al monitoreo ambiental, reportes ciudadanos y análisis ecológicos disponibles en ARIA.
              </p>

            </div>

            <table width="100%">
              <tr>
                <td align="center" style="padding:20px 0 30px 0;">

                  <a href="${verificationUrl}"
                     style="
                            background:#05682C;
                            color:#FFFFFF;
                            text-decoration:none;
                            padding:15px 36px;
                            border-radius:12px;
                            display:inline-block;
                            font-size:15px;
                            font-weight:bold;
                           ">
                    Verificar mi correo
                  </a>

                </td>
              </tr>
            </table>

            <p style="
                color:#557B5E;
                line-height:1.7;
                font-size:14px;
            ">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
            </p>

            <p style="
                word-break:break-all;
                color:#1E8344;
                font-size:14px;
            ">
              ${verificationUrl}
            </p>

            <div style="
                background:#F7FFF8;
                border:1px solid #CDE1D1;
                border-radius:12px;
                padding:16px;
                margin-top:25px;
            ">

              <p style="
                    margin:0;
                    color:#143B20;
                    font-size:14px;
                ">
                ⏳ Este enlace expirará en <strong>24 horas</strong>.
              </p>

            </div>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="
            background:#FAFDFC;
            border-top:1px solid #EBF1EC;
            padding:24px;
            text-align:center;
        ">

            <p style="
                color:#557B5E;
                font-size:12px;
                line-height:1.6;
                margin:0;
            ">
              ARIA © 2026<br>
              Sistema de monitoreo y gestión ambiental inteligente.
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
    `;