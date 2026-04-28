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
import { StaticScreenProps } from '@react-navigation/native';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_LIGHT = '#FEF3C7';
const AMBER_DARK = '#D97706';
const ORANGE = '#F97316';

type Props = StaticScreenProps<{ user: string }>;

const PROFILE = {
  name: 'John Doe',
  username: 'BestBeekeepr',
  level: 'Intermediate',
  location: 'Portland, OR',
  memberSince: 'March 2023',
  bio: 'Backyard beekeeper with 3 hives in Portland. Passionate about natural beekeeping and supporting local pollinators.',
  stats: [
    { label: 'Hives', value: '4' },
    { label: 'Inspections', value: '47' },
    { label: 'Posts', value: '12' },
    { label: 'Following', value: '28' },
  ],
  clubs: [
    { initials: 'PC', name: 'Portland City Bees', role: 'Owner' },
    { initials: 'OM', name: 'Oregon Master Beekeepers', role: 'Member' },
  ],
  recentActivity: [
    { emoji: '📋', text: 'Logged inspection on Hive #1 — North Apiary', time: '2h ago' },
    { emoji: '💬', text: 'Commented on Sarah Jenkins\'s post about splits', time: '5h ago' },
    { emoji: '⚖️', text: 'Logged weight: Hive #3 — 88.4 lbs', time: 'Yesterday' },
    { emoji: '📝', text: 'Added journal entry: Spring buildup notes', time: '2 days ago' },
    { emoji: '👥', text: 'Joined Oregon Master Beekeepers', time: '1 week ago' },
  ],
};

export function Profile({ route }: Props) {
  const { colors, theme } = useTheme();
  const username = route.params.user || PROFILE.username;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </View>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.surface }]} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={[styles.avatarRing, { borderColor: AMBER }]}>
            <View style={[styles.avatar, { backgroundColor: AMBER }]}>
              <Text style={styles.avatarText}>
                {PROFILE.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </View>

          <Text style={[styles.displayName, { color: colors.text }]}>{PROFILE.name}</Text>
          <Text style={[styles.usernameText, { color: colors.muted }]}>@{username}</Text>

          <View style={[styles.levelBadge, { backgroundColor: AMBER_LIGHT }]}>
            <Text style={[styles.levelText, { color: AMBER_DARK }]}>🐝  {PROFILE.level} Beekeeper</Text>
          </View>

          <View style={styles.locationRow}>
            <Text style={styles.pinEmoji}>📍</Text>
            <Text style={[styles.locationText, { color: colors.muted }]}>{PROFILE.location}</Text>
            <Text style={[styles.memberSince, { color: colors.muted }]}>· Member since {PROFILE.memberSince}</Text>
          </View>

          <Text style={[styles.bio, { color: colors.muted }]}>{PROFILE.bio}</Text>

          <TouchableOpacity style={[styles.editBtn, { borderColor: colors.border }]}>
            <Text style={[styles.editBtnText, { color: colors.text }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {PROFILE.stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Clubs */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>👥  My Clubs</Text>
            {PROFILE.clubs.map((club, idx) => (
              <TouchableOpacity
                key={club.name}
                style={[
                  styles.clubRow,
                  idx < PROFILE.clubs.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.clubAvatar, { backgroundColor: idx === 0 ? ORANGE : '#E5E7EB' }]}>
                  <Text style={[styles.clubAvatarText, { color: idx === 0 ? '#fff' : colors.muted }]}>
                    {club.initials}
                  </Text>
                </View>
                <View style={styles.clubInfo}>
                  <Text style={[styles.clubName, { color: colors.text }]}>{club.name}</Text>
                  <Text style={[styles.clubRole, { color: colors.muted }]}>{club.role}</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>📅  Recent Activity</Text>
            {PROFILE.recentActivity.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.activityRow,
                  idx < PROFILE.recentActivity.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
              >
                <Text style={styles.activityEmoji}>{item.emoji}</Text>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityText, { color: colors.text }]}>{item.text}</Text>
                  <Text style={[styles.activityTime, { color: colors.muted }]}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
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

  heroCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: { width: 78, height: 78, borderRadius: 39, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  displayName: { fontSize: 24, fontWeight: '800' },
  usernameText: { fontSize: 15 },
  levelBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginVertical: 4 },
  levelText: { fontSize: 13, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' },
  pinEmoji: { fontSize: 13 },
  locationText: { fontSize: 13 },
  memberSince: { fontSize: 13 },
  bio: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 4 },
  editBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  editBtnText: { fontSize: 14, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },

  section: { paddingHorizontal: 16, paddingTop: 10 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },

  clubRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  clubAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  clubAvatarText: { fontWeight: '700', fontSize: 14 },
  clubInfo: { flex: 1 },
  clubName: { fontSize: 14, fontWeight: '700' },
  clubRole: { fontSize: 12, marginTop: 1 },
  chevron: { fontSize: 20 },

  activityRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, gap: 12 },
  activityEmoji: { fontSize: 18, marginTop: 1 },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 14, lineHeight: 20 },
  activityTime: { fontSize: 12, marginTop: 2 },
});
