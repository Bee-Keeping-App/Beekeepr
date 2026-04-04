import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/clerk-expo';
import { styles } from './Login.styles';

// ─── Constants ────────────────────────────────────────────────────────────────

const APP_NAME = 'beekeepr';
const APP_TAGLINE = 'Your hive, your data.';
const CARD_TITLE = 'Welcome back';
const CARD_SUBTITLE = 'Sign in to your account to continue.';
const LABEL_EMAIL = 'Email';
const LABEL_PASSWORD = 'Password';
const PLACEHOLDER_EMAIL = 'you@example.com';
const PLACEHOLDER_PASSWORD = '••••••••';
const BUTTON_LABEL = 'Log In';
const FOOTER_TEXT = "Don't have an account?";
const FOOTER_LINK = 'Sign up';

// ─── Screen ───────────────────────────────────────────────────────────────────

interface LoginProps {
    onNavigateToRegister: () => void;
}

export function Login({ onNavigateToRegister }: LoginProps) {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!isLoaded) return;

        setError('');
        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: email.trim(),
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
            } else {
                setError('Sign in could not be completed. Please try again.');
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError?.errors?.[0]?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoSection}>
                        <Text style={styles.logoText}>{APP_NAME}</Text>
                        <Text style={styles.logoTagline}>{APP_TAGLINE}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{CARD_TITLE}</Text>
                        <Text style={styles.cardSubtitle}>{CARD_SUBTITLE}</Text>

                        <Text style={styles.fieldLabel}>{LABEL_EMAIL}</Text>
                        <View style={[styles.fieldWrapper, error ? styles.fieldWrapperError : undefined]}>
                            <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
                            <TextInput
                                style={styles.fieldInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={PLACEHOLDER_EMAIL}
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <Text style={styles.fieldLabel}>{LABEL_PASSWORD}</Text>
                        <View style={[styles.fieldWrapper, error ? styles.fieldWrapperError : undefined]}>
                            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
                            <TextInput
                                style={styles.fieldInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={PLACEHOLDER_PASSWORD}
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.showHideButton} onPress={() => setShowPassword(p => !p)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.submitButton, (!isLoaded || loading) && styles.submitButtonDisabled]}
                            onPress={handleLogin}
                            disabled={!isLoaded || loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#1A1A1A" />
                                : <Text style={styles.submitButtonText}>{BUTTON_LABEL}</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>{FOOTER_TEXT}</Text>
                        <TouchableOpacity onPress={onNavigateToRegister}>
                            <Text style={styles.footerLink}>{FOOTER_LINK}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
