You are a senior art director and creative front-end developer. Design and build the website for **SURAMU (スラム)**, a Japanese sushi delivery from the Brazilian "quebrada" (São Paulo periphery). Your goal: a site that stops people mid-scroll. Simple structure, loud visual voice.

## The brand
- **Name:** SURAMU, written スラム in katakana (from the English "slum"). Tagline on the logo: **"Real Sushi · Delivery de Quebrada"**.
- **Story:** Brazilian sushimen from the periphery who crossed the city for years to work in other people's sushi kitchens, learning the craft hands-on from Japanese masters. Now they cook in their own neighborhood, for their own people, with deep respect for the Japanese tradition. "Before sushi came to the quebrada, we went to sushi."
- **Stance (anti-mainstream Brazilian sushi):** "Nosso sushi não tem cream cheese." "Não trabalhamos com salmão." Only fish of the day, bought by the chef at the fish market before dawn (bonito, tuna, olho-de-boi/yellowtail, octopus, tobiko). Nigiri, sashimi, oshizushi, hosomaki, served in white takeaway boxes.
- **Personality:** street, raw, confident, a bit provocative, never a luxury cliché. Graffiti meets edomae. Hip-hop attitude and a disciplined knife.

## Visual references
1. **Layout reference: Global New Yorker by DD.NYC** (Behance). Take the *editorial structure*, not the luxury mood: oversized condensed display headlines bleeding off the edges, a very calm grid, small uppercase/mono microcopy, asymmetric photo placement, generous negative space, a minimal top nav.
2. **Brand assets (follow these closely):**
   - **Logo:** a white-outlined, hand-drawn graffiti tag ("SURAMU") with drippy, blobby, liquid strokes, usually on a red patch. Same lettering style is used for posters like "PESCADOS DO DIA" and "PEIXES DO DIA", where letters melt into little fish, bubbles and droplets.
   - **Katakana mark:** スラム flanked by asterisk/stick-figure glyphs (✱スラム✱).
   - **Pattern:** a tone-on-tone line-icon pattern of sushi, fish, chopsticks and bento boxes, drawn in slightly darker red over the red background.
   - **Display font:** a wide, high-contrast typeface with flared, wedge-like stroke endings (seen in "NOSSO SUSHI NÃO TEM CREAM CHEESE"). Use a close match (e.g. PP Hatton, Migra, or a free flared display from Google Fonts as fallback) and keep it in ALL CAPS for headlines.
   - **Text font:** a quirky geometric/techno grotesk with irregular letterforms for body and story text; pair with a small monospace for labels, prices and metadata.
   - **Highlight device:** single words set inside solid color blocks (white text on a red bar, or white text on a black bar) cutting across headlines.

## Color
- Sushi red `#C8141A` (primary, full-bleed sections)
- Coral red `#C94A4C` (secondary backgrounds)
- Charcoal `#2A2A2A` and black `#000000`
- Off-white `#F4F1EC` (editorial pages) and pure white for the tag lettering
- Pale pink `#F2B8B8` (oversized vertical "SURAMU" letters on light pages)
Few colors, used at full strength. No gradients, no gold, no glassmorphism.

## Photography direction
Raw, documentary, flash-lit: the chef holding a whole yellowtail like a trophy, the night fish market with plastic crates and fluorescent light, hands plating oshizushi, overhead shots of takeaway boxes on maroon tiles, a car at night on a São Paulo avenue. Mix polished food close-ups with gritty phone-camera moments. Use cut-out nigiri (background removed) overlapping typography, like the posters.

## Site structure (one long homepage first)
1. **Hero:** full-bleed red with the tile pattern, giant graffiti SURAMU tag, スラム mark, "Real Sushi · Delivery de Quebrada", one CTA: **"PEDIR AGORA"** (WhatsApp / iFood link). A cut-out nigiri breaking the frame.
2. **Manifesto:** huge flared type, one statement per screen: "NOSSO SUSHI NÃO TEM CREAM CHEESE" → "NÃO TRABALHAMOS COM SALMÃO" → "SÓ PEIXE DO DIA". Highlight-bar device on key words.
3. **Peixes do Dia:** a live "today's fish" board styled like the drippy poster (fish name, origin, cut), easy for the owner to update.
4. **Do mercado ao balcão:** a horizontal scrolling photo story from the 4 AM fish market to the cutting board to the box.
5. **Menu / Combos:** clean editorial list with mono prices, cut-out photos on hover.
6. **Nossa história:** the story text on off-white, with giant pale-pink vertical SURAMU letters and the katakana mark in the margin.
7. **Footer:** big red block, graffiti tag, delivery area, hours, Instagram, WhatsApp, "PEDIR AGORA" again.

## Motion
Purposeful and punchy, not floaty: headlines that slide in hard from the edge, highlight bars that "stamp" on, the graffiti tag drawing itself (SVG stroke animation), the pattern drifting slowly behind the hero, nigiri cut-outs with a small parallax. Respect `prefers-reduced-motion`.

## Copy
All site copy in Brazilian Portuguese, with street-level, direct voice ("da quebrada pra quebrada", "peixe fresco, sem frescura"). Short lines, no corporate language. Japanese only as accents (スラム, 本日の魚 for "fish of the day").

## Technical
- Mobile-first: most orders will come from phones on Instagram. The hero and the "PEDIR AGORA" CTA must work perfectly at 375px.
- Semantic HTML, CSS custom properties for the palette and type scale, light vanilla JS (GSAP is fine for scroll animation).
- Fast: optimized images (WebP/AVIF), lazy loading, no heavy frameworks unless needed.
- Accessible contrast on red backgrounds; real text, not text baked into images (except the graffiti logo SVG).

## First deliverable
Before writing code, give me:
1. A short creative concept (name + 3 sentences) and 2 to 3 distinct visual directions for the hero, each described in one paragraph.
2. The type scale and color tokens.
3. Then build the **hero + manifesto sections** as a working, responsive prototype so we can evaluate the visual impact before building the rest.
