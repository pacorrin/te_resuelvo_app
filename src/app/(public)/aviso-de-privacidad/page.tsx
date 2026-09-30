import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDocument,
  LegalSection,
} from "@/src/components/legal/LegalDocument";
import { legalConfig } from "@/src/lib/legal/legal-config";

export const metadata: Metadata = {
  title: `Aviso de privacidad | ${legalConfig.tradeName}`,
  description:
    "Aviso de privacidad de Te Resuelvo: qué datos personales se recaban, para qué se usan y cómo ejercer los derechos ARCO.",
};

export default function PrivacyNoticePage() {
  return (
    <LegalDocument
      title="Aviso de privacidad"
      description="Este aviso explica qué datos personales trata Te Resuelvo, con qué finalidad y cómo puedes ejercer tus derechos. Aplica al sitio, al registro de proveedores, a las solicitudes de servicio y al seguimiento de esas solicitudes."
    >
      <LegalSection title="1. Responsable">
        <p>
          El responsable del tratamiento de los datos personales es{" "}
          <strong>{legalConfig.tradeName}</strong>, operador del sitio{" "}
          <a href={legalConfig.siteUrl}>{legalConfig.siteUrl}</a>.
        </p>
        <p>
          Para cualquier asunto de privacidad, incluido el ejercicio de
          derechos ARCO, escribe a{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Datos personales que tratamos">
        <p>
          Solo pedimos los datos necesarios para conectar a quien necesita un
          servicio con un proveedor y para operar la cuenta correspondiente.
        </p>
        <p>
          <strong>Si solicitas un servicio como cliente</strong>, tratamos:
        </p>
        <ul>
          <li>Nombre, teléfono y correo electrónico.</li>
          <li>
            Descripción del servicio, tipo de servicio y respuestas a las
            preguntas del formulario.
          </li>
          <li>
            Dirección del servicio, referencias, código postal y ubicación en
            el mapa (latitud y longitud).
          </li>
          <li>
            Un código de acceso para consultar el seguimiento de tu solicitud.
          </li>
        </ul>
        <p>
          Con esos datos se crea un perfil de cliente asociado a tu correo.
          La contraseña de ese perfil no se usa para iniciar sesión en el
          panel de proveedores.
        </p>
        <p>
          <strong>Si te registras como proveedor</strong>, tratamos:
        </p>
        <ul>
          <li>Nombre, correo electrónico y contraseña.</li>
          <li>
            La contraseña se guarda únicamente como un hash. No almacenamos
            la contraseña en texto legible.
          </li>
          <li>
            Código de verificación de correo, identificador temporal de
            registro y el estado de verificación de la cuenta.
          </li>
          <li>
            Datos de tu organización: nombre, tipo de persona o negocio, RFC,
            correo y teléfono de contacto, domicilio fiscal, descripción e
            imagen.
          </li>
          <li>
            Servicios que ofreces, zonas de cobertura (nombre, dirección,
            coordenadas y radio) y miembros o invitaciones de tu equipo
            (correo y rol).
          </li>
          <li>
            Compras de solicitudes: monto, impuestos, fecha, estado del pago
            e identificador del comprobante.
          </li>
          <li>
            Seguimiento del trabajo: citas, cambios de estado, pagos que
            registres con el cliente, incidencias, cotizaciones y archivos
            que subas (logotipos, documentos o evidencia).
          </li>
        </ul>
        <p>
          <strong>Datos de pago con tarjeta.</strong> El cobro de las
          solicitudes lo procesa Stripe. Te Resuelvo no almacena el número
          completo de la tarjeta ni el código de seguridad.
        </p>
        <p>
          <strong>Datos de sesión.</strong> Usamos una cookie de sesión para
          mantener abierta la cuenta del proveedor y otra, de corta duración,
          para que el cliente consulte el seguimiento de su solicitud sin
          volver a identificarse en cada paso.
        </p>
        <p>
          No solicitamos datos sensibles, como origen racial, estado de salud,
          creencias, afiliación sindical o preferencia sexual. No uses el
          formulario para enviar ese tipo de información.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidades">
        <p>Usamos los datos para:</p>
        <ul>
          <li>Crear y verificar cuentas de proveedor.</li>
          <li>
            Recibir solicitudes de servicio y mostrarlas a proveedores de la
            zona y del giro correspondiente.
          </li>
          <li>
            Entregar al proveedor que adquiere la solicitud los datos de
            contacto del cliente, y mostrar al cliente los datos del proveedor
            asignado.
          </li>
          <li>
            Enviar correos de verificación, avisos de solicitud y avisos de
            asignación.
          </li>
          <li>Cobrar la compra de solicitudes y llevar el registro del pago.</li>
          <li>
            Permitir el seguimiento del servicio, citas, incidencias y
            archivos relacionados.
          </li>
          <li>
            Atender dudas, ejercer derechos de privacidad y mantener la
            seguridad de la plataforma.
          </li>
        </ul>
        <p>
          No usamos los datos para publicidad de terceros ni para vender
          listas de contacto.
        </p>
      </LegalSection>

      <LegalSection title="4. Con quién se comparten los datos">
        <p>
          <strong>
            Te Resuelvo no vende, renta ni cede datos personales a terceros
          </strong>{" "}
          para publicidad, prospección comercial ajena o elaboración de
          perfiles.
        </p>
        <p>
          Para que el servicio exista, sí comunicamos datos de contacto entre
          las personas que usan la plataforma:
        </p>
        <ul>
          <li>
            Al proveedor que adquiere una solicitud le compartimos el nombre,
            teléfono, correo, dirección y detalle del servicio del cliente,
            para que pueda cotizar y coordinar el trabajo.
          </li>
          <li>
            Al cliente le compartimos los datos de contacto del proveedor
            asignado a su solicitud.
          </li>
        </ul>
        <p>
          Esa comunicación se limita a la solicitud concreta. El proveedor
          solo puede usar los datos del cliente para atender esa solicitud y
          no para otros fines ni para transmitirlos a nadie más.
        </p>
        <p>
          Además, estos encargados tratan datos por cuenta de Te Resuelvo y
          solo para operar la plataforma:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong>, para procesar el pago con tarjeta de la
            compra de solicitudes.
          </li>
          <li>
            <strong>El proveedor de correo</strong> configurado en el sitio,
            para enviar códigos de verificación y avisos transaccionales.
          </li>
          <li>
            <strong>Mapbox</strong>, para mostrar el mapa y convertir la
            ubicación en una dirección.
          </li>
          <li>
            <strong>El proveedor de hospedaje</strong> de la aplicación y de
            la base de datos, para almacenar y servir el servicio.
          </li>
        </ul>
        <p>
          Estos encargados no quedan autorizados a usar los datos para sus
          propios fines comerciales.
        </p>
      </LegalSection>

      <LegalSection title="5. Derechos ARCO y revocación del consentimiento">
        <p>
          Puedes solicitar acceso, rectificación, cancelación u oposición al
          tratamiento de tus datos, y revocar el consentimiento que hayas
          otorgado, escribiendo a{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>
          .
        </p>
        <p>En la solicitud incluye:</p>
        <ul>
          <li>Tu nombre y un correo o teléfono de contacto.</li>
          <li>El derecho que quieres ejercer y una descripción clara.</li>
          <li>
            Los datos que permitan localizar tu cuenta o tu solicitud.
          </li>
        </ul>
        <p>
          Responderemos en un plazo máximo de 20 días hábiles. Si la
          solicitud es procedente, la haremos efectiva en los 15 días hábiles
          siguientes. Podemos pedirte información adicional para confirmar tu
          identidad.
        </p>
        <p>
          La cancelación no procede cuando la ley exija conservar el dato,
          por ejemplo un comprobante de pago, o cuando el dato sea necesario
          para cumplir una relación ya iniciada, como una solicitud que un
          proveedor ya adquirió.
        </p>
      </LegalSection>

      <LegalSection title="6. Conservación">
        <p>
          Conservamos los datos mientras la cuenta esté activa, mientras haga
          falta para prestar o acreditar el servicio, y durante los plazos
          que exijan las obligaciones fiscales y de comercio electrónico.
          Cuando dejen de ser necesarios, los bloqueamos y después los
          suprimimos o anonimizamos.
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Aplicamos medidas administrativas y técnicas para proteger los
          datos, entre ellas el hash de contraseñas, el acceso restringido al
          panel y la ocultación de los datos de contacto del cliente hasta que
          el proveedor adquiere la solicitud. Ningún sistema es infalible; si
          detectas un uso indebido de tu cuenta, avísanos de inmediato.
        </p>
      </LegalSection>

      <LegalSection title="8. Cambios a este aviso">
        <p>
          Podemos actualizar este aviso para reflejar cambios del servicio o
          de la ley. Publicaremos la versión vigente en esta misma página e
          indicaremos la fecha de actualización. El uso continuado del sitio
          después de un cambio implica que conoces la versión publicada.
        </p>
        <p>
          El uso de la plataforma también se rige por los{" "}
          <Link href={legalConfig.termsPath}>términos y condiciones</Link>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
