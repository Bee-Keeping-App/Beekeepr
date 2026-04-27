import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_LIGHT = '#FEF3C7';
const ORANGE = '#F97316';

interface Club {
  id: number;
  name: string;
  initials: string;
  role: 'Owner' | 'Member';
  members: number;
  description: string;
  isAdmin: boolean;
}

interface Post {
  id: number;
  author: string;
  initial: string;
  role: string;
  time: string;
  location: string;
  content: string;
  hasImage: boolean;
  likes: number;
  comments: number;
}

const CLUBS: Club[] = [
  {
    id: 1,
    name: 'Portland City Bees',
    initials: 'PC',
    role: 'Owner',
    members: 142,
    description: 'Urban beekeeping community in PDX.',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'Oregon Master Beekeepers',
    initials: 'OM',
    role: 'Member',
    members: 850,
    description: 'Professional beekeepers across Oregon.',
    isAdmin: false,
  },
];

const ONLINE_MEMBERS = [
  { name: 'Alice Walker', status: 'online' as const },
  { name: 'Bob Smith', status: 'away' as const },
  { name: 'Charlie Davis', status: 'offline' as const },
];

const STATUS_DOT: Record<string, string> = {
  online: '#22C55E',
  away: '#F97316',
  offline: '#D1D5DB',
};

const POSTS: Post[] = [
  {
    id: 1,
    author: 'Sarah Jenkins',
    initial: 'S',
    role: 'Master Beekeeper',
    time: '2 hours ago',
    location: 'Portland, OR',
    content:
      'Just finished my first split of the season! The new queen looks strong and is already laying. Here is a picture of the brood pattern.',
    hasImage: true,
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Bill Miller',
    initial: 'B',
    role: 'Hobbyist',
    time: 'Yesterday',
    location: 'Beaverton, OR',
    content:
      'Has anyone seen any mites in the West Hills area yet? I did a sugar roll test and found 0, but I want to stay vigilant.',
    hasImage: false,
    likes: 12,
    comments: 8,
  },
];

const ADMIN_TOOLS = [
  { emoji: '📢', label: 'Send Announcement' },
  { emoji: '👤', label: 'Manage Members' },
  { emoji: '⚙️', label: 'Club Settings' },
];

export function Community() {
  const { colors } = useTheme();
  const [selectedClub] = useState<Club>(CLUBS[0]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  function toggleLike(postId: number) {
    setLikedPosts((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={AMBER} />

      {/* Amber Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Community</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>
            Connect with local beekeepers and share your journey.
          </Text>
          <TouchableOpacity style={styles.newPostBtn}>
            <Text style={styles.newPostBtnText}>+  New Post</Text>
          </TouchableOpacity>
        </View>

        {/* Your Clubs */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.clubsIcon}>👥</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Clubs</Text>
            </View>
            {CLUBS.map((club) => (
              <View
                key={club.id}
                style={[
                  styles.clubRow,
                  club.id === selectedClub.id && { backgroundColor: AMBER_LIGHT },
                  { borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.clubAvatar,
                    { backgroundColor: club.id === selectedClub.id ? ORANGE : '#E5E7EB' },
                  ]}
                >
                  <Text
                    style={[
                      styles.clubAvatarText,
                      { color: club.id === selectedClub.id ? '#fff' : colors.muted },
                    ]}
                  >
                    {club.initials}
                  </Text>
                </View>
                <View style={styles.clubInfo}>
                  <Text style={[styles.clubName, { color: colors.text }]}>{club.name}</Text>
                  <Text style={[styles.clubMeta, { color: colors.muted }]}>
                    {club.role} • {club.members} Members
                  </Text>
                </View>
                {club.id === selectedClub.id && (
                  <View style={[styles.selectedBadge, { backgroundColor: AMBER_LIGHT, borderColor: AMBER }]}>
                    <Text style={{ color: AMBER, fontSize: 14 }}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Selected Club Detail */}
        {selectedClub.isAdmin && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.clubDetailName, { color: colors.text }]}>{selectedClub.name}</Text>
              <Text style={[styles.clubDetailDesc, { color: colors.muted }]}>{selectedClub.description}</Text>

              {/* Admin Tools */}
              <View style={[styles.adminToolsBox, { backgroundColor: AMBER_LIGHT }]}>
                <View style={styles.adminToolsHeader}>
                  <Text style={[styles.adminToolsIcon, { color: ORANGE }]}>🛡</Text>
                  <Text style={[styles.adminToolsTitle, { color: ORANGE }]}>ADMIN TOOLS</Text>
                </View>
                {ADMIN_TOOLS.map((tool) => (
                  <TouchableOpacity
                    key={tool.label}
                    style={[styles.adminToolBtn, { backgroundColor: colors.background, borderColor: AMBER }]}
                  >
                    <Text style={styles.adminToolEmoji}>{tool.emoji}</Text>
                    <Text style={[styles.adminToolLabel, { color: colors.text }]}>{tool.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Online Members */}
              <View style={styles.onlineMembersSection}>
                <View style={styles.onlineMembersHeader}>
                  <Text style={[styles.onlineMembersTitle, { color: colors.muted }]}>ONLINE MEMBERS</Text>
                  <View style={styles.activeCountBadge}>
                    <Text style={styles.activeCountText}>3 ACTIVE</Text>
                  </View>
                </View>
                {ONLINE_MEMBERS.map((member) => (
                  <View key={member.name} style={styles.memberRow}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[member.status] }]} />
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.viewEventsBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Text style={[styles.viewEventsBtnText, { color: colors.text }]}>View Club Events</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Feed Header */}
        <View style={styles.section}>
          <View style={[styles.feedHeaderCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View
              style={[styles.clubAvatar, { backgroundColor: AMBER_LIGHT, width: 48, height: 48, borderRadius: 24 }]}
            >
              <Text style={[styles.clubAvatarText, { color: ORANGE, fontSize: 15 }]}>PC</Text>
            </View>
            <View style={styles.feedHeaderInfo}>
              <Text style={[styles.clubName, { color: colors.text }]}>{selectedClub.name}</Text>
              <Text style={[styles.clubMeta, { color: colors.muted }]}>Feed</Text>
            </View>
            <TouchableOpacity style={[styles.adminViewBadge, { backgroundColor: AMBER_LIGHT, borderColor: AMBER }]}>
              <Text style={[styles.adminViewText, { color: AMBER_DARK }]}>🛡 Admin View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Compose Placeholder */}
        <View style={styles.section}>
          <View style={[styles.composePlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.avatarSmall, { backgroundColor: AMBER }]}>
              <Text style={styles.avatarSmallText}>JD</Text>
            </View>
            <TextInput
              editable={false}
              placeholder={`Share an update with ${selectedClub.name}...`}
              placeholderTextColor={colors.muted}
              style={[styles.composeInput, { color: colors.muted }]}
            />
          </View>
        </View>

        {/* Posts */}
        {POSTS.map((post) => {
          const liked = likedPosts.has(post.id);
          return (
            <View style={styles.section} key={post.id}>
              <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={[styles.postAvatar, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={[styles.postAvatarText, { color: colors.muted }]}>{post.initial}</Text>
                  </View>
                  <View style={styles.postAuthorInfo}>
                    <Text style={[styles.postAuthorName, { color: colors.text }]}>{post.author}</Text>
                    <Text style={[styles.postMeta, { color: colors.muted }]}>
                      {post.role} • {post.time}
                    </Text>
                  </View>
                  <View style={styles.postLocationRow}>
                    <Text style={styles.pinEmoji}>📍</Text>
                    <Text style={[styles.postLocation, { color: colors.muted }]}>{post.location}</Text>
                  </View>
                  <TouchableOpacity style={styles.moreBtn}>
                    <Text style={[styles.moreDots, { color: colors.muted }]}>•••</Text>
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

                {/* Image Placeholder */}
                {post.hasImage && (
                  <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.imagePlaceholderText, { color: colors.muted }]}>📷 Post content</Text>
                  </View>
                )}

                {/* Post Actions */}
                <View style={[styles.postActions, { borderTopColor: colors.border }]}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(post.id)}>
                    <Text style={[styles.actionIcon, liked && { color: '#EF4444' }]}>
                      {liked ? '♥' : '♡'}
                    </Text>
                    <Text style={[styles.actionCount, { color: colors.muted }]}>
                      {post.likes + (liked ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={[styles.actionCount, { color: colors.muted }]}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>↗</Text>
                    <Text style={[styles.actionCount, { color: colors.muted }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const AMBER_DARK = '#D97706';

const styles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  scrollView: { flex: 1 },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  pageSubtitle: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  newPostBtn: {
    alignSelf: 'flex-start',
    backgroundColor: ORANGE,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  newPostBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  section: { paddingHorizontal: 20, paddingTop: 12 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  clubsIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },

  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  clubAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubAvatarText: { fontWeight: '700', fontSize: 14 },
  clubInfo: { flex: 1 },
  clubName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  clubMeta: { fontSize: 13 },
  selectedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  clubDetailName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  clubDetailDesc: { fontSize: 14, marginBottom: 14 },
  adminToolsBox: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },
  adminToolsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  adminToolsIcon: { fontSize: 14 },
  adminToolsTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  adminToolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  adminToolEmoji: { fontSize: 16 },
  adminToolLabel: { fontSize: 15, fontWeight: '500' },

  onlineMembersSection: { gap: 0 },
  onlineMembersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  onlineMembersTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  activeCountBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  activeCountText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  memberName: { fontSize: 15 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  viewEventsBtn: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewEventsBtnText: { fontSize: 14, fontWeight: '600' },

  feedHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  feedHeaderInfo: { flex: 1 },
  adminViewBadge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminViewText: { fontSize: 13, fontWeight: '700' },

  composePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  avatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: { fontWeight: '700', fontSize: 13, color: '#fff' },
  composeInput: { flex: 1, fontSize: 15 },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarText: { fontWeight: '700', fontSize: 16 },
  postAuthorInfo: { flex: 1 },
  postAuthorName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  postMeta: { fontSize: 13 },
  postLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pinEmoji: { fontSize: 12 },
  postLocation: { fontSize: 13 },
  moreBtn: { paddingLeft: 8 },
  moreDots: { fontSize: 16, letterSpacing: 1 },

  postContent: { fontSize: 16, lineHeight: 24, marginBottom: 12 },
  imagePlaceholder: {
    borderRadius: 10,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: { fontSize: 14 },

  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 0,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionIcon: { fontSize: 18 },
  actionCount: { fontSize: 14, fontWeight: '500' },
});
