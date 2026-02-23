import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Job Portal API',
        version: '1.0.0',
        description: 'API documentation for the Online Job Portal backend'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    statusCode: { type: 'integer' },
                    message: { type: 'string' },
                    data: {
                        type: 'object',
                        nullable: true
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    statusCode: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Error occurred' },
                    data: { nullable: true }
                }
            },
            Notification: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '67dbfdb2f3f5dfad56c0a31a' },
                    recipientId: { type: 'string' },
                    actorId: { type: 'string', nullable: true },
                    type: { type: 'string', enum: ['FOLLOW', 'NEW_POST', 'POST_LIKED', 'POST_COMMENTED'] },
                    title: { type: 'string' },
                    message: { type: 'string' },
                    entityType: { type: 'string', nullable: true },
                    entityId: { type: 'string', nullable: true },
                    isRead: { type: 'boolean' },
                    status: { type: 'string', enum: ['PENDING', 'SENT', 'FAILED'] },
                    readAt: { type: 'string', format: 'date-time', nullable: true },
                    sentAt: { type: 'string', format: 'date-time', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    paths: {
        '/api/auth/register/seeker': {
            post: {
                summary: 'Register a new Job Seeker',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/auth/register/company': {
            post: {
                summary: 'Register a new Company Profile',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    companyName: { type: 'string' },
                                    contactNumber: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Login User',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/seeker/profile': {
            get: {
                summary: 'Get Seeker Profile',
                tags: ['Seeker'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            },
            put: {
                summary: 'Update Seeker Profile',
                tags: ['Seeker'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    firstName: { type: 'string', example: 'John' },
                                    lastName: { type: 'string', example: 'Doe' },
                                    skills: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js', 'TypeScript'] },
                                    experience: { type: 'integer', example: 5 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/seeker/profile/photo': {
            post: {
                summary: 'Upload Seeker Photo',
                tags: ['Seeker'],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    photo: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/seeker/jobs': {
            get: {
                summary: 'Search Jobs',
                tags: ['Seeker'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'keyword', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/seeker/jobs/{jobId}/apply': {
            post: {
                summary: 'Apply for a Job',
                tags: ['Seeker'],
                parameters: [
                    { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    coverLetter: { type: 'string' },
                                    resume: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/seeker/applications': {
            get: {
                summary: 'Get My Applications',
                tags: ['Seeker'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/profile': {
            get: {
                summary: 'Get Company Profile',
                tags: ['Company'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            },
            put: {
                summary: 'Update Company Profile',
                tags: ['Company'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    companyName: { type: 'string', example: 'Acme Corp' },
                                    contactNumber: { type: 'string', example: '+1234567890' },
                                    address: { type: 'string', example: '123 Business Rd, Tech City' },
                                    website: { type: 'string', example: 'https://acme.corp' },
                                    description: { type: 'string', example: 'A leading technology company.' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/profile/logo': {
            post: {
                summary: 'Upload Company Logo',
                tags: ['Company'],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    logo: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/jobs': {
            post: {
                summary: 'Post a Job',
                tags: ['Company'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', example: 'Senior Frontend Developer' },
                                    description: { type: 'string', example: 'We are looking for an experienced developer...' },
                                    requirements: { type: 'string', example: '5+ years experience in React' },
                                    skillsRequired: { type: 'array', items: { type: 'string' }, example: ['React', 'TypeScript', 'CSS'] },
                                    salaryRange: { type: 'string', example: '$100k - $130k' },
                                    location: { type: 'string', example: 'Remote' },
                                    jobType: { type: 'string', enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], example: 'FULL_TIME' },
                                    workplaceType: { type: 'string', enum: ['REMOTE', 'ONSITE', 'HYBRID'], example: 'REMOTE' },
                                    experienceLevel: { type: 'string', example: 'Senior' },
                                    applicationDeadline: { type: 'string', format: 'date-time', example: '2026-12-31T23:59:59Z' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            },
            get: {
                summary: 'Get Company Jobs',
                tags: ['Company'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/jobs/{jobId}': {
            put: {
                summary: 'Update a Job',
                tags: ['Company'],
                parameters: [
                    { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { type: 'object' } }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/jobs/{jobId}/applications': {
            get: {
                summary: 'Get Job Applications',
                tags: ['Company'],
                parameters: [
                    { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/company/applications/{appId}': {
            put: {
                summary: 'Update Application Status',
                tags: ['Company'],
                parameters: [
                    { name: 'appId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/social/feed': {
            get: {
                summary: 'Get personalized feed',
                tags: ['Social'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/feed/global': {
            get: {
                summary: 'Get global feed',
                tags: ['Social'],
                security: [],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/social/follow/{userId}': {
            post: {
                summary: 'Follow a user',
                tags: ['Social'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Followed',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/unfollow/{userId}': {
            post: {
                summary: 'Unfollow a user',
                tags: ['Social'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Unfollowed',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/followers': {
            get: {
                summary: 'Get current user followers',
                tags: ['Social'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/followers/{userId}': {
            get: {
                summary: 'Get followers by user id',
                tags: ['Social'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/following': {
            get: {
                summary: 'Get current user following list',
                tags: ['Social'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/following/{userId}': {
            get: {
                summary: 'Get following list by user id',
                tags: ['Social'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/posts': {
            post: {
                summary: 'Create a post',
                tags: ['Social'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string', example: 'Excited to start a new role today!' }
                                }
                            }
                        },
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string', example: 'Check out this update!' },
                                    image: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/posts/{postId}': {
            get: {
                summary: 'Get post by id',
                tags: ['Social'],
                parameters: [
                    { name: 'postId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '404': {
                        description: 'Not Found',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            },
            delete: {
                summary: 'Delete post',
                tags: ['Social'],
                parameters: [
                    { name: 'postId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Deleted',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '404': {
                        description: 'Not Found',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/posts/{postId}/like': {
            post: {
                summary: 'Like a post',
                tags: ['Social'],
                parameters: [
                    { name: 'postId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Liked',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            },
            delete: {
                summary: 'Unlike a post',
                tags: ['Social'],
                parameters: [
                    { name: 'postId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Unliked',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/posts/{postId}/comment': {
            post: {
                summary: 'Add a comment to a post',
                tags: ['Social'],
                parameters: [
                    { name: 'postId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string', example: 'Great post!' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '400': {
                        description: 'Bad Request',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/social/comments/{commentId}': {
            delete: {
                summary: 'Delete a comment',
                tags: ['Social'],
                parameters: [
                    { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Deleted',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    },
                    '404': {
                        description: 'Not Found',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                    }
                }
            }
        },
        '/api/notifications': {
            get: {
                summary: 'Get my notifications',
                tags: ['Notifications'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 } },
                    { name: 'unreadOnly', in: 'query', schema: { type: 'boolean', example: false } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/notifications/unread-count': {
            get: {
                summary: 'Get unread notifications count',
                tags: ['Notifications'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/notifications/read-all': {
            patch: {
                summary: 'Mark all notifications as read',
                tags: ['Notifications'],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/notifications/{notificationId}/read': {
            patch: {
                summary: 'Mark one notification as read',
                tags: ['Notifications'],
                parameters: [
                    { name: 'notificationId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    },
                    '404': {
                        description: 'Not Found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/admin/users': {
            get: {
                summary: 'Get All Users',
                tags: ['Admin'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'role', in: 'query', schema: { type: 'string', enum: ['SEEKER', 'COMPANY', 'ADMIN'] } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/admin/users/{userId}/block': {
            put: {
                summary: 'Toggle User Block Status',
                tags: ['Admin'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    isBlocked: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/admin/jobs/pending': {
            get: {
                summary: 'Get Pending Jobs',
                tags: ['Admin'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/admin/jobs/{jobId}/approve': {
            put: {
                summary: 'Approve Job',
                tags: ['Admin'],
                parameters: [
                    { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/api/admin/jobs/{jobId}/reject': {
            put: {
                summary: 'Reject Job',
                tags: ['Admin'],
                parameters: [
                    { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        }
    }
};

export const swaggerDocs = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
