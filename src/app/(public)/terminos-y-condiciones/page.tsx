import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDocument,
  LegalSection,
} from "@/src/components/legal/LegalDocument";
import { legalConfig } from "@/src/lib/legal/legal-config";

export const metadata: Metadata = {
  title: `Términos y condiciones | ${legalConfig.tradeName}`,
  description:
    "Términos y condiciones de uso de Te Resuelvo para clientes y proveedores de servicios.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Términos y condiciones"
      description="Estas condiciones regulan el uso de Te Resuelvo por parte de quienes solicitan un servicio y de quienes se registran como proveedores."
    >
      <LegalSection title="1. Qué es Te Resuelvo">
        <p>
          <strong>{legalConfig.tradeName}</strong> es una plataforma en{" "}
          <a href={legalConfig.siteUrl}>{legalConfig.siteUrl}</a> que conecta
          a personas que necesitan un servicio con proveedores que ofrecen ese
          servicio en su zona.
        </p>
        <p>
          Te Resuelvo intermedia el contacto. No presta el servicio del hogar
          o del oficio, no emplea a los proveedores y no es parte del acuerdo
          que el cliente y el proveedor celebren entre sí sobre precio, fecha
          o forma de hacer el trabajo.
        </p>
      </LegalSection>

      <LegalSection title="2. Aceptación">
        <p>
          Al crear una cuenta de proveedor, al enviar una solicitud de
          servicio o al usar el sitio, aceptas estos términos y el{" "}
          <Link href={legalConfig.privacyPath}>aviso de privacidad</Link>. Si
          no estás de acuerdo, no uses la plataforma.
        </p>
        <p>
          Debes ser mayor de edad y contar con capacidad legal para contratar.
          Si registras una organización, declaras que tienes facultades para
          obligarla.
        </p>
      </LegalSection>

      <LegalSection title="3. Cuentas de proveedor">
        <p>Para registrarte como proveedor debes proporcionar datos veraces y:</p>
        <ul>
          <li>Usar un correo al que tengas acceso.</li>
          <li>Verificar ese correo con el código que te enviamos.</li>
          <li>
            Elegir una contraseña de al menos 8 caracteres y mantenerla en
            secreto.
          </li>
        </ul>
        <p>
          Eres responsable de la actividad que ocurra con tu cuenta. Avisa a{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>{" "}
          si sospechas un acceso no autorizado.
        </p>
        <p>
          El alta de la organización, el RFC, el domicilio fiscal, los
          servicios y las zonas de cobertura deben corresponder a la actividad
          real que ofreces. Te Resuelvo puede rechazar, suspender o pedir
          corrección de perfiles incompletos, falsos o que no correspondan al
          giro publicado.
        </p>
      </LegalSection>

      <LegalSection title="4. Solicitudes de los clientes">
        <p>
          El cliente describe el servicio, su ubicación y sus datos de
          contacto. Esa información debe ser real y suficiente para que un
          proveedor pueda valorar el trabajo.
        </p>
        <p>
          Enviar una solicitud no obliga al cliente a contratar a ningún
          proveedor, ni obliga a Te Resuelvo a conseguir un número mínimo de
          cotizaciones. El cliente compara y decide con quién trabajar.
        </p>
        <p>
          El seguimiento de la solicitud se consulta con el correo y el código
          de acceso que enviamos. Ese código es personal; no lo compartas con
          quien no deba ver el estado del servicio.
        </p>
      </LegalSection>

      <LegalSection title="5. Compra de solicitudes">
        <p>
          Los proveedores pueden ver solicitudes compatibles con su zona y
          sus servicios. Los datos de contacto del cliente permanecen ocultos
          hasta que el proveedor adquiere esa solicitud.
        </p>
        <p>
          Al pagar una solicitud, el proveedor obtiene el derecho a contactar
          a ese cliente por ese trabajo. La compra es un contacto, no una
          venta cerrada ni una garantía de que el cliente contrate, responda
          o pague el servicio.
        </p>
        <p>
          El precio se muestra antes de pagar, en pesos mexicanos. El pago se
          procesa con tarjeta a través de Stripe. El contacto se libera cuando
          el pago queda confirmado.
        </p>
        <p>
          La compra es definitiva: al confirmarse el pago se entregan datos
          personales del cliente y ese acto no puede deshacerse. No hay
          reembolso porque el cliente no conteste, elija a otro proveedor o
          el trabajo no se concrete. Si el cargo se realiza y la plataforma
          no entrega el contacto por una falla atribuible a Te Resuelvo,
          corregiremos la entrega o reembolsaremos ese cargo.
        </p>
      </LegalSection>

      <LegalSection title="6. Uso de los datos de contacto">
        <p>
          El proveedor solo puede usar el nombre, teléfono, correo y dirección
          del cliente para cotizar y, si lo contratan, prestar el servicio de
          esa solicitud.
        </p>
        <p>Queda prohibido:</p>
        <ul>
          <li>
            Usar esos datos para publicidad, bases de datos propias ajenas a
            la solicitud o para revender el contacto.
          </li>
          <li>
            Contactar al cliente por un servicio distinto al que solicitó.
          </li>
          <li>
            Hostigar, suplantar a Te Resuelvo o dar información falsa sobre
            precios, identidad o disponibilidad.
          </li>
        </ul>
        <p>
          El cliente, a su vez, usa los datos del proveedor solo para evaluar
          y coordinar el servicio solicitado.
        </p>
      </LegalSection>

      <LegalSection title="7. Relación entre cliente y proveedor">
        <p>
          Precio, alcance, materiales, garantías, citas y forma de pago del
          trabajo se acuerdan directamente entre el cliente y el proveedor.
          Te Resuelvo no supervisa la ejecución del oficio, no garantiza la
          calidad, la puntualidad ni el resultado, y no responde por daños,
          incumplimientos o disputas entre ellos.
        </p>
        <p>
          Cada proveedor es responsable de contar con los permisos, la
          capacidad técnica y, cuando aplique, los seguros y las obligaciones
          fiscales de su actividad. El registro en la plataforma no equivale
          a una certificación oficial.
        </p>
      </LegalSection>

      <LegalSection title="8. Conducta en la plataforma">
        <p>No está permitido:</p>
        <ul>
          <li>
            Publicar información falsa, ofensiva, ilegal o que infrinja
            derechos de terceros.
          </li>
          <li>
            Intentar acceder a cuentas, solicitudes o pagos de otra persona.
          </li>
          <li>
            Interferir con el funcionamiento del sitio, extraer datos de forma
            masiva o eludir el pago de una solicitud.
          </li>
          <li>
            Usar la plataforma para actividades ilícitas o para enviar spam.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Propiedad intelectual">
        <p>
          El sitio, la marca, el logotipo, los textos de la plataforma y el
          software son de Te Resuelvo o de sus licenciantes. Puedes usarlos
          solo para operar tu cuenta o enviar una solicitud. No copies ni
          reutilices la plataforma para crear un servicio competidor.
        </p>
        <p>
          Conservas los derechos sobre los textos, imágenes y archivos que
          subes. Nos das una licencia no exclusiva para alojarlos y
          mostrarlos dentro de la plataforma con el fin de prestar el
          servicio.
        </p>
      </LegalSection>

      <LegalSection title="10. Disponibilidad y cambios del servicio">
        <p>
          Procuramos que el sitio esté disponible, pero puede haber
          interrupciones por mantenimiento, fallas o causas ajenas a Te
          Resuelvo. Podemos modificar funciones, precios de solicitudes futuras
          o estos términos. Los precios ya pagados no cambian de forma
          retroactiva.
        </p>
        <p>
          Si cambiamos estos términos de manera relevante, publicaremos la
          versión nueva en esta página. Seguir usando la plataforma después
          de la publicación implica que aceptas esa versión.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitación de responsabilidad">
        <p>
          El sitio se ofrece tal como está disponible. En la medida que la ley
          lo permita, Te Resuelvo no responde por lucro cesante, pérdida de
          oportunidades ni daños indirectos derivados del uso de la plataforma
          o de la relación entre cliente y proveedor.
        </p>
        <p>
          Cuando la ley no permita excluir la responsabilidad, esta se limita
          al monto que el proveedor haya pagado a Te Resuelvo por la solicitud
          concreta que originó el reclamo, o, si no hubo pago, a la obligación
          de restablecer el acceso o corregir la falla.
        </p>
      </LegalSection>

      <LegalSection title="12. Suspensión y cancelación">
        <p>
          Puedes dejar de usar la plataforma en cualquier momento. Si quieres
          cerrar tu cuenta de proveedor, escríbenos a{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>
          .
        </p>
        <p>
          Podemos suspender o cancelar una cuenta si hay incumplimiento de
          estos términos, uso indebido de datos de contacto, fraude en los
          pagos o riesgo para otros usuarios. La cancelación no borra los
          comprobantes de pago que debamos conservar.
        </p>
      </LegalSection>

      <LegalSection title="13. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos
          Mexicanos. Para cualquier controversia, las partes se someten a los
          tribunales competentes de México, sin perjuicio de los derechos
          irrenunciables que la ley reconozca a los consumidores.
        </p>
        <p>
          El tratamiento de datos personales se describe en el{" "}
          <Link href={legalConfig.privacyPath}>aviso de privacidad</Link>.
        </p>
      </LegalSection>

      <LegalSection title="14. Contacto">
        <p>
          Dudas sobre estos términos:{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
