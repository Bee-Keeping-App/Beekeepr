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
const ORANGE = '#F97316';

const POST = {
  author: 'Sarah Jenkins',
  initial: 'S',
  role: 'Master Beekeeper',
  time: '2 hours ago',
  location: 'Portland, OR',
  content:
    'Just finished my first split of the season! The new queen looks strong and is already laying. Here is a picture of the brood pattern. The colony was incredibly gentle during the whole process — barely needed smoke. Has anyone else done splits this early in the season? Curious about your experiences with success rates.',
  hasImage: true,
  likes: 24,
  comments: 5,
};

const COMMENTS = [
  {
    id: 1,
    author: 'Bill Miller',
    initial: 'B',
    role: 'Hobbyist',
    time: '1 hour ago',
    text: 'Great work! I did a split last week and my new queen is just starting to lay. Fingers crossed she builds up fast.',
    likes: 4,
  },
  {
    id: 2,
    author: 'Maria Chen',
    initial: 'M',
    role: 'Commercial Beekeeper',
    time: '45 min ago',
    text: 'Splits this early can be risky if a cold snap hits. Make sure she has enough nurse bees to keep brood warm. Looks like a beautiful pattern though!',
    likes: 7,
  },
  {
    id: 3,
    author: 'Tom Hargrove',
    initial: 'T',
    role: 'Master Beekeeper',
    time: '20 min ago',
    text: 'What queen-rearing method did you use? Did you let them raise their own or introduce a mated queen?',
    likes: 2,
  },
  {
    id: 4,
    author: 'Alice Walker',
    initial: 'A',
    role: 'Hobbyist',
    time: '10 min ago',
    text: 'Stunning brood pattern — that\'s a productive queen! Following this thread to see how she develops.',
    likes: 3,
  },
  {
    id: 5,
    author: 'James Orton',
    initial: 'J',
    role: 'Hobbyist',
    time: '5 min ago',
    text: 'Congrats! I love doing splits in spring. Which apiary is this from?',
    likes: 1,
  },
];

export function PostDetails() {
  const { colors, theme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  function toggleCommentLike(id: number) {
    setLikedComments((prev: Set<number>) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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
        {/* Original Post */}
        <View style={[styles.postCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.postHeader}>
            <View style={[styles.avatar, { backgroundColor: '#E5E7EB' }]}>
              <Text style={[styles.avatarText, { color: colors.muted }]}>{POST.initial}</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>{POST.author}</Text>
              <Text style={[styles.authorMeta, { color: colors.muted }]}>{POST.role} • {POST.time}</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.pinEmoji}>📍</Text>
              <Text style={[styles.locationText, { color: colors.muted }]}>{POST.location}</Text>
            </View>
          </View>

          <Text style={[styles.postContent, { color: colors.text }]}>{POST.content}</Text>

          {POST.hasImage && (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
              <Text style={[styles.imagePlaceholderText, { color: colors.muted }]}>📷  Brood pattern photo</Text>
            </View>
          )}

          <View style={[styles.postActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setLiked(!liked)}>
              <Text style={[styles.actionIcon, liked && { color: '#EF4444' }]}>{liked ? '♥' : '♡'}</Text>
              <Text style={[styles.actionCount, { color: colors.muted }]}>{POST.likes + (liked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={[styles.actionCount, { color: colors.muted }]}>{POST.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>↗</Text>
              <Text style={[styles.actionCount, { color: colors.muted }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: colors.text }]}>
            Comments ({COMMENTS.length})
          </Text>

          {COMMENTS.map((comment) => {
            const isLiked = likedComments.has(comment.id);
            return (
              <View
                key={comment.id}
                style={[styles.commentCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <View style={styles.commentHeader}>
                  <View style={[styles.commentAvatar, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={[styles.commentAvatarText, { color: colors.muted }]}>{comment.initial}</Text>
                  </View>
                  <View style={styles.commentAuthorInfo}>
                    <Text style={[styles.commentAuthorName, { color: colors.text }]}>{comment.author}</Text>
                    <Text style={[styles.commentMeta, { color: colors.muted }]}>{comment.role} • {comment.time}</Text>
                  </View>
                </View>
                <Text style={[styles.commentText, { color: colors.text }]}>{comment.text}</Text>
                <TouchableOpacity style={styles.commentLikeBtn} onPress={() => toggleCommentLike(comment.id)}>
                  <Text style={[styles.commentLikeIcon, isLiked && { color: '#EF4444' }]}>{isLiked ? '♥' : '♡'}</Text>
                  <Text style={[styles.commentLikeCount, { color: colors.muted }]}>
                    {comment.likes + (isLiked ? 1 : 0)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Reply Bar */}
      <View style={[styles.replyBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={[styles.replyAvatar, { backgroundColor: AMBER }]}>
          <Text style={styles.replyAvatarText}>JD</Text>
        </View>
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder="Add a comment…"
          placeholderTextColor={colors.muted}
          style={[styles.replyInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          multiline
        />
        <TouchableOpacity
          style={[styles.replyBtn, { backgroundColor: replyText.trim() ? ORANGE : colors.border }]}
          disabled={!replyText.trim()}
        >
          <Text style={styles.replyBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
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

  postCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', fontSize: 18 },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  authorMeta: { fontSize: 13 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  pinEmoji: { fontSize: 12 },
  locationText: { fontSize: 12 },
  postContent: { fontSize: 16, lineHeight: 25, marginBottom: 14 },
  imagePlaceholder: {
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  imagePlaceholderText: { fontSize: 14 },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionIcon: { fontSize: 20 },
  actionCount: { fontSize: 14, fontWeight: '500' },

  commentsSection: { paddingHorizontal: 16, gap: 10 },
  commentsTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  commentCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  commentAvatarText: { fontWeight: '700', fontSize: 14 },
  commentAuthorInfo: { flex: 1 },
  commentAuthorName: { fontSize: 14, fontWeight: '700' },
  commentMeta: { fontSize: 12 },
  commentText: { fontSize: 14, lineHeight: 21 },
  commentLikeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end' },
  commentLikeIcon: { fontSize: 16 },
  commentLikeCount: { fontSize: 13 },

  replyBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  replyAvatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  replyInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  replyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  replyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
