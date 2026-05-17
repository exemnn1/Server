import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, errorEmbed, successEmbed, infoEmbed, warningEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError, TitanBotError, ErrorTypes } from '../../utils/errorHandler.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
const facts = [
  "Bananas are berries, but strawberries are not.",
  "Honey never spoils and can last thousands of years.",
  "Sharks existed before trees.",
  "A day on Mars is only about 37 minutes longer than a day on Earth.",
  "Wombat poop is cube-shaped.",
  "There are more possible chess games than atoms in the observable universe.",
  "Hot water can freeze faster than cold water under certain conditions (Mpemba effect).",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses can taste with their arms.",
  "Some turtles can breathe through their butts.",
  "Sloths can hold their breath longer than dolphins.",
  "The Eiffel Tower can grow more than 6 inches in summer due to heat expansion.",
  "There is a species of jellyfish that is biologically immortal.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "The human nose can detect over 1 trillion smells.",
  "Butterflies taste with their feet.",
  "Cows have best friends and get stressed when separated.",
  "A single teaspoon of neutron star would weigh billions of tons.",
  "Koalas have fingerprints almost identical to humans.",
  "Some metals explode when dropped into water.",
  "Venus rotates backwards compared to most planets.",
  "A shrimp's heart is located in its head.",
  "The longest hiccuping spree lasted 68 years.",
  "Sea otters hold hands while sleeping so they don’t drift apart.",
  "Humans share about 60% of DNA with bananas.",
  "There is enough DNA in your body to stretch to the sun and back many times.",
  "A bolt of lightning can contain up to 1 billion volts.",
  "Tardigrades can survive in space without protection.",
  "The tongue is the strongest muscle in the human body (relative to size).",
  "Cheetahs can’t roar, they purr like cats.",
  "The shortest war in history lasted under an hour.",
  "Some frogs can be frozen and survive afterward.",
  "The moon has moonquakes.",
  "Dolphins have names for each other.",
  "A cloud can weigh over a million pounds.",
  "Bananas glow blue under black light.",
  "The Great Wall of China is not visible from the Moon with the naked eye.",
  "A day on Mercury lasts 176 Earth days.",
  "There are more fake flamingos on Earth than real ones.",
  "The heart of a blue whale is the size of a car.",
  "Sea cucumbers can eject their internal organs as defense.",
  "There is a planet made of diamond (theorized).",
  "Humans blink around 20 times per minute on average.",
  "A bolt of lightning can strike the same place twice.",
  "Some lizards can detach their tails to escape predators.",
  "Pineapples take about 2 years to grow.",
  "Gold can be hammered into sheets so thin they are see-through.",
  "Sharks do not get cancer very often.",
  "A single strand of spaghetti is called a 'spaghetto'.",
  "Humans are the only animals that cry emotional tears.",
  "The inventor of the Frisbee was turned into a Frisbee after death.",
  "Some worms can regenerate their entire bodies from one segment.",
  "There are more possible moves in Go than atoms in the universe.",
  "A sneeze can travel up to 100 mph.",
  "A cockroach can live for weeks without its head.",
  "The Pacific Ocean is larger than all land combined.",
  "The human brain uses about 20% of the body’s energy.",
  "The Statue of Liberty was originally copper-colored, not green.",
  "Some frogs can survive being frozen solid.",
  "The longest word in English has 189,819 letters (a protein name).",
  "There are more stars in space than grains of sand on Earth.",
  "A snail can sleep for three years.",
  "Polar bears have black skin under their white fur.",
  "A group of crows is called a murder.",
  "Venus is hotter than Mercury despite being farther from the Sun.",
  "Some fish can walk on land.",
  "The human body glows faintly in complete darkness.",
  "A bolt of lightning can light a 100-watt bulb for months.",
  "The average cloud weighs about 1.1 million pounds.",
  "Some metals become liquid at room temperature.",
  "The Amazon rainforest produces about 20% of Earth’s oxygen.",
  "A blue whale’s tongue can weigh as much as an elephant.",
  "Humans and giraffes have the same number of neck vertebrae.",
  "Some turtles can breathe through their cloaca.",
  "There are more bacteria in your body than human cells.",
  "A crocodile cannot stick its tongue out.",
  "Some spiders can fly using silk threads.",
  "The shortest commercial flight lasts about 90 seconds.",
  "The human eye can distinguish about 10 million colors.",
  "A bolt of lightning can reach 30,000 Kelvin.",
  "Penguins propose to their mates with pebbles.",
  "Some plants eat insects for nutrients.",
  "The moon is slowly moving away from Earth.",
  "Octopuses have distributed brains in their arms.",
  "A group of pandas is called an embarrassment.",
  "Some frogs can survive being dried out completely.",
  "The Earth is not a perfect sphere, it is slightly squashed.",
  "Lightning strikes Earth about 8 million times per day.",
  "Some bacteria can survive radiation levels that would kill humans instantly.",
  "A day on Pluto lasts about 6 Earth days and 9 hours.",
  "The smell of rain has a name: petrichor.",
  "Some trees communicate through underground fungal networks.",
  "The coldest temperature ever recorded on Earth was -128.6°F (-89.2°C).",
  "Humans are more closely related to mushrooms than to plants.",
  "A group of hedgehogs is called a prickle."
];

export default {
    data: new SlashCommandBuilder()
    .setName("fact")
    .setDescription("Shares a random, interesting fact."),
  category: 'Fun',

  async execute(interaction, config, client) {
    try {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];

      const embed = successEmbed("🧠 Did You Know?", `💡 **${randomFact}**`);

      await InteractionHelper.safeReply(interaction, { embeds: [embed] });
      logger.debug(`Fact command executed by user ${interaction.user.id} in guild ${interaction.guildId}`);
    } catch (error) {
      logger.error('Fact command error:', error);
      await handleInteractionError(interaction, error, {
        commandName: 'fact',
        source: 'fact_command'
      });
    }
  },
};




