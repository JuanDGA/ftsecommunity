<template>
  <v-row class="mt-16 pt-16">
    <v-col cols="4" v-for="(proposal, i) in proposals" :key="i">
      <v-card rounded color="green lighten-5" class="mx-2">
        <v-card-title>{{ proposal.title }}</v-card-title>
        <v-card-text>{{ proposal.description }}</v-card-text>
        <v-card-actions>
          <v-btn color="green lighten-2" :to="`/chat/${proposal.id}`">Discuss</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      proposals: [
        {
          title: "Invertir en una máquina de compostaje",
          description: "¿Estaría dispuesto a invertir en una máquina de compostaje que trabaje de forma automática y convierta los residuos orgánicos en abono que beneficie las huertas locales?",
          id: 0,
        },
        {
          title: "Pago justo por el servicio",
          description: "¿Cuánto cree que sería el precio justo a pagar mensualmente por el manejo de sus residuos orgánicos?",
          id: 1,
        },
        {
          title: "Ofertas de productos",
          description: "¿Le gustaría recibir ofertas especiales de los productos que se generan en las huertas locales?",
          id: 2,
        }
      ],
    }),
  }
</script>