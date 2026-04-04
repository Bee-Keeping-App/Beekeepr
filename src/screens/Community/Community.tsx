import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { styles } from './Community.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Club {
    id: string;
    initials: string;
    avatarColor: string;
    name: string;
    role: string;
    memberCount: number;
}

interface AdminTool {
    id: string;
    icon: string;
    label: string;
}

interface Post {
    id: string;
    initials: string;
    author: string;
    authorMeta: string;
    body: string;
    hasImage: boolean;
    likes: number;
    comments: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

//We need to hook this in to the correct api data, but for now we'll use some hardcoded examples to build out the UI and data flow

const PAGE_TITLE = 'Community';
const PAGE_SUBTITLE = 'Connect with local beekeepers and share your journey.';
const SECTION_YOUR_CLUBS = 'Your Clubs';
const ADMIN_TOOLS_LABEL = 'ADMIN TOOLS';

const CLUBS: Club[] = [
    { id: '1', initials: 'PC', avatarColor: '#F5A623', name: 'Portland City Bees', role: 'Owner', memberCount: 142 },
    { id: '2', initials: 'OM', avatarColor: '#6B7280', name: 'Oregon Master Beekeepers', role: 'Member', memberCount: 850 },
];

const ADMIN_TOOLS: AdminTool[] = [
    { id: '1', icon: 'megaphone-outline', label: 'Send Announcement' },
    { id: '2', icon: 'people-outline', label: 'Manage Members' },
    { id: '3', icon: 'settings-outline', label: 'Club Settings' },
];

const POSTS: Post[] = [
    {
        id: '1',
        initials: 'SJ',
        author: 'Sarah Jenkins',
        authorMeta: 'Master Beekeeper • 2 hours ago',
        body: 'PlaceholderText1 PlaceholderText2 PlaceholderText3 PlaceholderText4 PlaceholderText5 PlaceholderText6 PlaceholderText7 PlaceholderText8.',
        hasImage: true,
        likes: 24,
        comments: 5,
    },
    {
        id: '2',
        initials: 'BM',
        author: 'Bill Miller',
        authorMeta: 'Hobbyist • Yesterday',
        body: 'PlaceholderText1 PlaceholderText2 PlaceholderText3 PlaceholderText4 PlaceholderText5 PlaceholderText6?',
        hasImage: false,
        likes: 12,
        comments: 8,
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ClubItem({ club }: { club: Club }) {
    const roleLabel = `${club.role} • ${club.memberCount} members`;

    return (
        <TouchableOpacity style={styles.clubItem}>
            <View style={[styles.clubAvatar, { backgroundColor: club.avatarColor }]}>
                <Text style={styles.clubAvatarText}>{club.initials}</Text>
            </View>
            <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubRole}>{roleLabel}</Text>
            </View>
            <View style={styles.clubChevron}>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
}

function AdminToolsCard() {
    return (
        <View style={styles.adminCard}>
            <Text style={styles.adminLabel}>{ADMIN_TOOLS_LABEL}</Text>
            {ADMIN_TOOLS.map((tool, index) => (
                <TouchableOpacity
                    key={tool.id}
                    style={[styles.adminTool, index === ADMIN_TOOLS.length - 1 && styles.adminToolLast]}
                >
                    <Ionicons name={tool.icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color="#F5A623" />
                    <Text style={styles.adminToolText}>{tool.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

function PostCard({ post }: { post: Post }) {
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                    <Text style={styles.postAvatarText}>{post.initials}</Text>
                </View>
                <View style={styles.postMeta}>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                    <Text style={styles.postAuthorMeta}>{post.authorMeta}</Text>
                </View>
                <TouchableOpacity style={styles.postMoreButton}>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <Text style={styles.postBody}>{post.body}</Text>

            {post.hasImage && (
                <View style={styles.postImagePlaceholder}>
                    <Ionicons name="image-outline" size={28} color="#D1D5DB" />
                    <Text style={styles.postImageLabel}>Post content</Text>
                </View>
            )}

            <View style={styles.postActions}>
                <TouchableOpacity style={styles.postActionItem}>
                    <Ionicons name="heart-outline" size={16} color="#6B7280" />
                    <Text style={styles.postActionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postActionItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                    <Text style={styles.postActionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postActionItem}>
                    <Ionicons name="share-outline" size={16} color="#6B7280" />
                    <Text style={styles.postActionText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function Community() {
    return (
        <View style={styles.screen}>
            <AppHeader />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>{PAGE_TITLE}</Text>
                    <Text style={styles.pageSubtitle}>{PAGE_SUBTITLE}</Text>
                    <TouchableOpacity style={styles.newPostButton}>
                        <Ionicons name="add" size={16} color="#1A1A1A" />
                        <Text style={styles.newPostButtonText}>New Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{SECTION_YOUR_CLUBS}</Text>
                    {CLUBS.map((club) => (
                        <ClubItem key={club.id} club={club} />
                    ))}
                </View>

                <View style={styles.section}>
                    <AdminToolsCard />
                </View>

                <View style={styles.feedDivider} />

                {POSTS.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </ScrollView>
        </View>
    );
}
