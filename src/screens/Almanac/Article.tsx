import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_LIGHT = '#FEF3C7';
const AMBER_DARK = '#D97706';

const ARTICLE = {
  title: 'Spring Splits: How to Divide a Hive and Prevent Swarming',
  author: 'Dr. Emily Carr',
  role: 'Master Beekeeper, OSU Extension',
  date: 'March 10, 2026',
  readTime: '6 min read',
  category: 'Colony Management',
  sections: [
    {
      heading: 'Why Split?',
      body: 'As spring arrives and nectar flows begin, colonies grow rapidly. A strong colony left unchecked will swarm — taking roughly half your bees and your queen to a new home. Splitting mimics the natural swarm impulse and lets you stay in control: you keep your bees, expand your apiary, and redirect that explosive energy into honey production.',
    },
    {
      heading: 'When to Split',
      body: 'The right time is when your colony has:\n\n• 8 or more frames of bees\n• Plenty of capped brood and eggs\n• Sufficient honey and pollen stores\n• Daytime temperatures consistently above 55°F\n\nIn most of North America this falls between late March and mid-May. Watch for queen cells as a warning sign — if the bees are already building them, split immediately.',
    },
    {
      heading: 'The Walk-Away Split',
      body: 'The simplest method requires no purchased queen. Find the original queen and move her, 2–3 frames of brood, 1–2 frames of honey/pollen, and a frame of bees into a new hive body. Fill both boxes to strength with remaining frames.\n\nThe queenless half will raise a new queen from the youngest larvae. Check back in 4 weeks for a laying queen.',
    },
    {
      heading: 'Introducing a Mated Queen',
      body: 'For faster buildup, purchase a mated queen and introduce her to the queenless split within 24 hours using a candy-plug cage. This cuts re-queening time from 4 weeks to 10 days and gives you a known, proven queen from quality genetics.\n\nAlways confirm the old queen is gone before introduction — a virgin queen already in the hive will kill the introduced queen.',
    },
    {
      heading: 'Post-Split Care',
      body: 'Check both hives after 7 days:\n\n• Original hive: confirm the queen is laying normally.\n• New split: confirm queen cells are present and intact — don\'t open it more than needed.\n\nFeed 1:1 sugar syrup to both halves for 2 weeks to help them draw comb and nurse brood. Reduce the entrance on the new split to prevent robbing.',
    },
  ],
  tags: ['Splits', 'Swarm Control', 'Queen Rearing', 'Spring Management'],
  relatedArticles: [
    'Understanding Swarm Biology',
    'Queen Rearing Basics for Hobbyists',
    'Reading Brood Patterns',
  ],
};

export function Article() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={AMBER} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </View>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.surface }]} showsVerticalScrollIndicator={false}>
        {/* Category Tag */}
        <View style={styles.metaSection}>
          <View style={[styles.categoryBadge, { backgroundColor: AMBER_LIGHT }]}>
            <Text style={[styles.categoryText, { color: AMBER_DARK }]}>{ARTICLE.category}</Text>
          </View>

          <Text style={[styles.articleTitle, { color: colors.text }]}>{ARTICLE.title}</Text>

          <View style={[styles.authorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.authorAvatar, { backgroundColor: AMBER }]}>
              <Text style={styles.authorAvatarText}>EC</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>{ARTICLE.author}</Text>
              <Text style={[styles.authorRole, { color: colors.muted }]}>{ARTICLE.role}</Text>
            </View>
            <View style={styles.articleMeta}>
              <Text style={[styles.articleDate, { color: colors.muted }]}>{ARTICLE.date}</Text>
              <Text style={[styles.readTime, { color: colors.muted }]}>⏱ {ARTICLE.readTime}</Text>
            </View>
          </View>
        </View>

        {/* Article Body */}
        <View style={styles.bodySection}>
          {ARTICLE.sections.map((section, idx) => (
            <View key={idx} style={styles.articleSection}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>{section.heading}</Text>
              <Text style={[styles.sectionBody, { color: colors.muted }]}>{section.body}</Text>
            </View>
          ))}
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={[styles.tagsLabel, { color: colors.muted }]}>Tags</Text>
          <View style={styles.tagRow}>
            {ARTICLE.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.muted }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related Articles */}
        <View style={[styles.relatedSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.relatedTitle, { color: colors.text }]}>📚  Related Articles</Text>
          {ARTICLE.relatedArticles.map((title, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.relatedRow,
                idx < ARTICLE.relatedArticles.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.relatedRowText, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.relatedArrow, { color: colors.muted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Beekeeping Tip Callout */}
        <View style={[styles.tipCard, { backgroundColor: AMBER_LIGHT }]}>
          <Text style={styles.tipTitle}>🐝  Pro Tip</Text>
          <Text style={styles.tipBody}>
            Mark your calendar 28 days after a walk-away split. If no queen is laying by then, you may have a queen-less hive — act quickly by adding a frame of fresh eggs from a healthy colony.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLogo: { fontSize: 20, fontWeight: '800', color: '#1C1917', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  scrollView: { flex: 1 },

  metaSection: { padding: 20, gap: 14 },
  categoryBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  articleTitle: { fontSize: 26, fontWeight: '800', lineHeight: 34 },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  authorAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '700' },
  authorRole: { fontSize: 12, marginTop: 1 },
  articleMeta: { alignItems: 'flex-end', gap: 2 },
  articleDate: { fontSize: 12 },
  readTime: { fontSize: 12 },

  bodySection: { paddingHorizontal: 20, gap: 24 },
  articleSection: { gap: 8 },
  sectionHeading: { fontSize: 18, fontWeight: '800' },
  sectionBody: { fontSize: 15, lineHeight: 25 },

  tagsSection: { paddingHorizontal: 20, paddingTop: 24, gap: 10 },
  tagsLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 13, fontWeight: '500' },

  relatedSection: { margin: 20, borderRadius: 16, borderWidth: 1, padding: 16 },
  relatedTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  relatedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  relatedRowText: { fontSize: 14, fontWeight: '500', flex: 1, paddingRight: 8 },
  relatedArrow: { fontSize: 20 },

  tipCard: { marginHorizontal: 20, marginBottom: 8, borderRadius: 16, padding: 16 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#92400E', marginBottom: 6 },
  tipBody: { fontSize: 14, color: '#92400E', lineHeight: 22 },
});
