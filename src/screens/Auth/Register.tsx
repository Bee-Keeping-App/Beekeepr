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
import { useSignUp, useAuth } from '@clerk/clerk-expo';
import { createAccountProfile } from '../../services/api';
import { styles } from './Register.styles';

// ─── Constants ────────────────────────────────────────────────────────────────

const APP_NAME = 'beekeepr';
const APP_TAGLINE = 'Your hive, your data.';
const CARD_TITLE = 'Create account';
const CARD_SUBTITLE = 'Start tracking your hives today.';
const LABEL_EMAIL = 'Email';
const LABEL_PASSWORD = 'Password';
const LABEL_PHONE = 'Phone';
const OPTIONAL_TAG = '(optional)';
const PLACEHOLDER_EMAIL = 'you@example.com';
const PLACEHOLDER_PASSWORD = 'Min. 8 characters';
const PLACEHOLDER_PHONE = '+1 (555) 000-0000';
const BUTTON_LABEL = 'Create Account';
const FOOTER_TEXT = 'Already have an account?';
const FOOTER_LINK = 'Log in';

// ─── Screen ───────────────────────────────────────────────────────────────────

interface RegisterProps {
    onNavigateToLogin: () => void;
}

export function Register({ onNavigateToLogin }: RegisterProps) {
    const { signUp, setActive, isLoaded } = useSignUp();
    const { getToken } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!isLoaded) return;

        setError('');
        setLoading(true);

        try {
            const result = await signUp.create({
                emailAddress: email.trim(),
                password,
            });

            if (result.status === 'complete') {
                // Activate the Clerk session
                await setActive({ session: result.createdSessionId });

                // Create the MongoDB account profile linked to this Clerk user
                const token = await getToken();
                if (token) {
                    await createAccountProfile({
                        token,
                        email: email.trim(),
                        phone: phone.trim() || undefined,
                    });
                }
            } else {
                // Clerk may require additional steps (e.g. email verification)
                setError('Please check your email to verify your account.');
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

                        <Text style={styles.fieldLabel}>
                            {LABEL_PHONE}{' '}
                            <Text style={styles.optionalTag}>{OPTIONAL_TAG}</Text>
                        </Text>
                        <View style={styles.fieldWrapper}>
                            <Ionicons name="call-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
                            <TextInput
                                style={styles.fieldInput}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={PLACEHOLDER_PHONE}
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.submitButton, (!isLoaded || loading) && styles.submitButtonDisabled]}
                            onPress={handleRegister}
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
                        <TouchableOpacity onPress={onNavigateToLogin}>
                            <Text style={styles.footerLink}>{FOOTER_LINK}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
