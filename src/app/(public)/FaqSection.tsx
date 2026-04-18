import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

const faqs = [
  {
    question: "¿Cómo funciona el servicio?",
    answer:
      "Completas el formulario con los detalles de tu necesidad, los proveedores verificados reciben tu solicitud y te contactan directamente por WhatsApp o correo electrónico con sus presupuestos. Tú eliges con quién trabajar.",
  },
  {
    question: "¿Tengo que pagar por solicitar el servicio?",
    answer:
      "No, solicitar servicios es completamente gratuito para los clientes. Solo pagarás directamente al proveedor cuando decidas contratar sus servicios y acuerdes el precio con él.",
  },
  {
    question: "¿Los proveedores están verificados?",
    answer:
      "Sí, todos nuestros proveedores pasan por un proceso de verificación que incluye validación de identidad, referencias profesionales y antecedentes. Solo trabajamos con profesionales confiables.",
  },
  {
    question: "¿En cuánto tiempo recibiré respuestas?",
    answer:
      "Generalmente recibirás las primeras respuestas en las siguientes 2-4 horas. Los proveedores interesados revisarán tu solicitud y te contactarán directamente si están disponibles para tu proyecto.",
  },
  {
    question: "¿Necesito registrarme para usar el servicio?",
    answer:
      "No es necesario registrarte ni crear una cuenta. Solo completa el formulario con tus datos de contacto y descripción del servicio. Es rápido, simple y sin complicaciones.",
  },
  {
    question: "¿Qué pasa si no me convence ningún proveedor?",
    answer:
      "No tienes ninguna obligación. Puedes revisar todos los presupuestos que recibas y decidir libremente si contratas alguno o no. El servicio es sin compromisos de tu parte.",
  },
];

export function FaqSection() {
  return (
    <section className="px-4 md:px-6 py-12 md:py-16 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground">
            Todo lo que necesitas saber sobre nuestro servicio
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿No encontraste la respuesta que buscabas?
          </p>
          <Button variant="outline">Contáctanos</Button>
        </div>
      </div>
    </section>
  );
}
